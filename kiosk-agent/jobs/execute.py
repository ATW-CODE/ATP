from api.client import get, patch
import time


def execute_job(job):
    job_id = job["id"]

    try:
        print(f"[EXECUTE] Printing job {job_id}")

        # Download file
        file_res = get(f"/files/{job['file_id']}", stream=True)
        file_path = f"/tmp/{job['file_id']}.pdf"

        with open(file_path, "wb") as f:
            for chunk in file_res.iter_content(8192):
                f.write(chunk)

        # Simulate printing
        time.sleep(3)

        # TODO: Replace with real printer call
        print("[EXECUTE] Print success")

        # Mark completed
        patch(f"/print/jobs/{job_id}/status", json={
            "status": "completed"
        })

    except Exception as e:
        print("[EXECUTE] Print failed:", e)

        # Notify backend
        patch(f"/print/jobs/{job_id}/status", json={
            "status": "failed",
            "error": str(e)
        })
