import time
from api.client import post
from config import PRINTER_ID, HEARTBEAT_INTERVAL

def send_heartbeat():
  """
  Notify backend that the kiosk is alive.
  """
  response = post(
    "/kiosk/heartbeat",
    json={"printerId": PRINTER_ID}
  )

  if response.status_code == 200:
    print("[HEARTBEAT] Printer online.")
  else:
    print("[HEARTBEAT] Failed",
          response.status_code,
          response.text
    )

def start_heartbeat_loop():
  """
  Run heartbeat loop forever.
  """
  print("[HEARTBEAT] Started")

  while True:
    try:
      send_heartbeat()
    except Exception as e:
      print("[HEARTBEAT] Error:", e)

    time.sleep(HEARTBEAT_INTERVAL)
