import requests
from config import (API_BASE_URL, KIOSK_SECRET, REQUEST_TIMEOUT, DOWNLOAD_TIMEOUT)

HEADERS = {
  "x-Kiosk-Secret": KIOSK_SECRET,
  "Content-Type": "application/json"
}

def post(path, json=None):
  """
  Send a POST request to the backend API.
  """
  return requests.post(
    f"{API_BASE_URL}{path}",
    headers=HEADERS,
    json=json,
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
