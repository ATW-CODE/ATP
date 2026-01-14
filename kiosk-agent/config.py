# config.py
# Central configuration for the Raspberry Pi kiosk agent

# Backend API base URL
API_BASE_URL = "http://localhost:5000"

# Shared secret for kiosk authentication
KIOSK_SECRET = "supersecretkioskkey"

# This kiosk is bound to ONE physical printer
PRINTER_ID = "a97241e3-9028-41db-82be-a383ed22ce70"

# Polling intervals (seconds)
JOB_POLL_INTERVAL = 5
HEARTBEAT_INTERVAL = 10

# Local storage for downloaded files
DOWNLOAD_DIR = "/tmp/atp_print_jobs"

# Network timeouts (seconds)
REQUEST_TIMEOUT = 10
DOWNLOAD_TIMEOUT = 30
