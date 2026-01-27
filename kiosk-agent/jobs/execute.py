from api.client import get, patch
import subprocess
import os
import time

PRINTER_NAME = "ATP_Printer_01"  # must match CUPS exactly
DOWNLOAD_DIR = "/tmp/atp-print-jobs"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def execute_job(job):
    job_id = job["id"]
    file_id = job["file_id"]

    try:
        print(f"[EXECUTE] Printing job {job_id}")

        # mark as printing
        patch(f"/kiosk/jobs/{job_id}/status", json={"status": "printing"})

        os.makedirs(DOWNLOAD_DIR, exist_ok=True)

        # download file
        file_res = get(f"/files/{job['file_id']}", stream=True)
        file_path = os.path.join(
            DOWNLOAD_DIR,
            f"{job['file_id']}.pdf"
        )

        print("DEBUG FILE PATH =", file_path)

        with open(file_path, "wb") as f:
            for chunk in file_res.iter_content(8192):
                f.write(chunk)

        # ---- REAL PRINT ----
        result = subprocess.run(
            ["lp", "-d", PRINTER_NAME, file_path],
            capture_output=True,
            text=True,
            check=True
        )

        print("[EXECUTE] lp output: ",	result.stdout.strip())
        print("[EXECUTE] lp stderr: ", result.stderr)
        time.sleep(2)


        # mark completed
        r = patch(f"/kiosk/jobs/{job_id}/status", json={
                "status": "completed"
            })

        print(f"[DEBUG] completed status response: ", r.status_code, r.text)

        print(f"[EXECUTE] Job {job_id} completed successfully")

    except subprocess.CalledProcessError as e:
        print("[EXECUTE] CUPS Printing failed:", e.stderr)

        patch(f"/kiosk/jobs/{job_id}/status", json={
            "status": "failed",
            "error": e.stderr	
        })

    except Exception as e:
        print("[EXECUTE] Unexpected error:", str(e))

        patch(f"/kiosk/jobs/{job_id}/status", json={
            "status": "failed",
            "error": str(e)
            }
        )


    finally:
        # optional cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
