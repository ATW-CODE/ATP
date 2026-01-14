import time
from api.client import post, patch
from config import PRINTER_ID
from jobs.execute import execute_job

def claim_job():
  res = post(
    "/kiosk/jobs/claim",
    params={"printerId": PRINTER_ID}
  )

  if res.status_code == 204:
    print("[CLAIM] No job available.")
    return None
  
  if res.status_code != 200:
    print("[CLAIM] Failed:",
          res.text
    )
    return None
  
  job = res.json()
  print(f"[CLAIM] Job Claimed: {job['id']}")
  return job

def process_job(job):
    job_id = job["id"]

    print(f"[PRINT] Printing job {job_id}")
    time.sleep(5)  # simulate printing time

    patch(
        f"/print/jobs/{job_id}/status",
        json={"status": "completed"}
    )

    print(f"[PRINT] Job {job_id} completed")

def start_worker_loop():
    print("[WORKER] Started")

    while True:
        try:
          job = claim_job()

          if job:
              process_job(job)
              execute_job(job)
        
        except Exception as e:
          print("[WORKER] Error:", e)

        time.sleep(3)
