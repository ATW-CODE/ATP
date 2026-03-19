import threading
from jobs.heartbeat import start_heartbeat_loop
from jobs.claim import start_worker_loop


def main():
  t1 = threading.Thread(target=start_heartbeat_loop, daemon=True)
  t2 = threading.Thread(target=start_worker_loop, daemon=True)

  t1.start()
  t2.start()

  t1.join()
  t2.join()


if __name__ == "__main__":
      main()
