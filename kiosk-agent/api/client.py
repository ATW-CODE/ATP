import requests
import os
from config import (API_BASE_URL, KIOSK_SECRET, REQUEST_TIMEOUT, DOWNLOAD_TIMEOUT, PRINTER_API_KEY, TOKEN_FILE)

def _get_token():
  if os.path.exists(TOKEN_FILE):
      return open(TOKEN_FILE).read().strip()


  res = requests.post(
      API_BASE_URL + "/kiosk/auth",
      headers={"X-API-KEY": PRINTER_API_KEY}
  )

  res.raise_for_status()
  token = res.json()["token"]

  with open (TOKEN_FILE, "w") as f:
      f.write(token)

  os.chmod(TOKEN_FILE, 0o600)
  return token

HEADERS = {
  "x-Kiosk-Secret": KIOSK_SECRET,
  "X-API-KEY": PRINTER_API_KEY,
  "Content-Type": "application/json"
  }

def post(path, json=None, params=None):
  """
  Send a POST request to the backend API.
  """
  return requests.post(
    f"{API_BASE_URL}{path}",
    headers=HEADERS,
    json=json,
    params=params,
    timeout=REQUEST_TIMEOUT
  )

def patch(path, json=None):
  """
  Send a PATCH request to the backend API.
  """
  return requests.patch(
    f"{API_BASE_URL}{path}",
    headers=HEADERS,
    json=json,
    timeout=REQUEST_TIMEOUT
  )

def get(path, stream=False):
  """
  Send a GET request to the backend API.
  """
  return requests.get(
    f"{API_BASE_URL}{path}",
    headers=HEADERS,
    stream=stream,
    timeout=DOWNLOAD_TIMEOUT if stream else REQUEST_TIMEOUT
  )
