from api.client import get, patch
import subprocess
import os
import time

PRINTER_NAME = "HPM305dn"   # Must match CUPS exactly
DOWNLOAD_DIR = "/tmp/atp-print-jobs"

os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def execute_job(job):
    job_id = job["id"]
    file_id = job["file_id"]

    file_path = os.path.join(DOWNLOAD_DIR, f"{file_id}.pdf")

    try:
        print(f"[EXECUTE] Starting job {job_id}")

        # Mark as printing
        patch(f"/kiosk/jobs/{job_id}/status", json={"status": "printing"})

        # Download file from backend
        print("[EXECUTE] Downloading file...")
        file_res = get(f"/files/{file_id}", stream=True)

        with open(file_path, "wb") as f:
            for chunk in file_res.iter_content(8192):
                f.write(chunk)

        print(f"[DEBUG] File saved to {file_path}")

        # ---------------------------
        # Build CUPS command
        # ---------------------------
        cups_command = [
            "lp",
            "-d", PRINTER_NAME,
            "-n", str(job.get("copies", 1))
        ]

        # Duplex handling
        if job.get("duplex"):
            cups_command += ["-o", "Duplex=DuplexNoTumble"]
        else:
            cups_command += ["-o", "Duplex=None"]

        # Orientation
        if job.get("orientation") == "landscape":
            cups_command += ["-o", "orientation-requested=4"]

        # # Color
        # if job.get("color"):
        #     cups_command += ["-o", "ColorModel=Color"]
        # else:
        #     cups_command += ["-o", "ColorModel=Gray"]

        # File path
        cups_command.append(file_path)

        print("[EXECUTE] Running:", " ".join(cups_command))

        result = subprocess.run(
            cups_command,
            capture_output=True,
            text=True,
            check=True
        )

        print("[EXECUTE] lp stdout:", result.stdout.strip())
        print("[EXECUTE] lp stderr:", result.stderr.strip())

        time.sleep(2)

        # Mark as completed
        r = patch(
            f"/kiosk/jobs/{job_id}/status",
            json={"status": "completed"}
        )

        print(f"[EXECUTE] Job {job_id} completed")

    except subprocess.CalledProcessError as e:
        print("[ERROR] CUPS failed:", e.stderr)

        patch(
            f"/kiosk/jobs/{job_id}/status",
            json={
                "status": "failed",
                "error": e.stderr
            }
        )

    except Exception as e:
        print("[ERROR] Unexpected error:", str(e))

        patch(
            f"/kiosk/jobs/{job_id}/status",
            json={
                "status": "failed",
                "error": str(e)
            }
        )

    finally:
        if os.path.exists(file_path):
        #    os.remove(file_path)
        #    print("[CLEANUP] File removed")
             print("No CleanUP")
