import asyncio
import uuid
import logging
import threading
import time
from typing import Any, Optional

logger = logging.getLogger(__name__)

jobs: dict[str, dict] = {}


def _monitor_traffic(job_id: str, stop: threading.Event, direction: str):
    import psutil
    prev_ts = time.time()
    if direction == "download":
        prev = psutil.net_io_counters().bytes_recv
        key = "download_speed"
    else:
        prev = psutil.net_io_counters().bytes_sent
        key = "upload_speed"

    while not stop.is_set():
        time.sleep(0.5)
        curr_ts = time.time()
        curr = psutil.net_io_counters().bytes_recv if direction == "download" else psutil.net_io_counters().bytes_sent
        dt = curr_ts - prev_ts
        if dt > 0:
            speed = (curr - prev) * 8 / 1_000_000 / dt
            jobs[job_id][key] = round(max(speed, 0), 2)
        prev, prev_ts = curr, curr_ts


def _run_speedtest(job_id: str) -> dict:
    import speedtest
    st = speedtest.Speedtest()

    jobs[job_id]["phase"] = "Finding optimal server..."
    st.get_best_server()

    jobs[job_id]["phase"] = "Testing download speed..."
    stop_mon = threading.Event()
    mon = threading.Thread(target=_monitor_traffic, args=(job_id, stop_mon, "download"), daemon=True)
    mon.start()
    download_mbps = st.download(threads=12) / 1_000_000
    stop_mon.set()
    mon.join()
    jobs[job_id]["download_speed"] = round(download_mbps, 2)

    jobs[job_id]["phase"] = "Testing upload speed..."
    stop_mon = threading.Event()
    mon = threading.Thread(target=_monitor_traffic, args=(job_id, stop_mon, "upload"), daemon=True)
    mon.start()
    upload_mbps = st.upload(threads=8) / 1_000_000
    stop_mon.set()
    mon.join()
    jobs[job_id]["upload_speed"] = round(upload_mbps, 2)

    latency = st.results.ping
    server_info = getattr(st.results, 'server', {})
    server_name = server_info.get('sponsor', 'Unknown') if isinstance(server_info, dict) else str(st.best_host)

    return {
        "download_mbps": round(download_mbps, 2),
        "upload_mbps": round(upload_mbps, 2),
        "latency_ms": round(latency, 2),
        "server": server_name,
    }


async def run_speedtest_job(job_id: str, db_session_factory=None):
    logger.info("Starting speedtest job: %s", job_id)
    jobs[job_id] = {"status": "running", "phase": "Starting...", "download_speed": 0, "upload_speed": 0, "result": None}

    try:
        result = await asyncio.to_thread(_run_speedtest, job_id)
        jobs[job_id] = {"status": "done", "result": result}

        if db_session_factory:
            try:
                from app.services.db_service import save_speedtest
                async with db_session_factory() as session:
                    await save_speedtest(
                        session,
                        download_mbps=result["download_mbps"],
                        upload_mbps=result["upload_mbps"],
                        latency_ms=result["latency_ms"],
                        server=result["server"],
                    )
                logger.info("Speedtest result saved to database")
            except Exception as db_err:
                logger.error("Failed to save speedtest to DB: %s", db_err)

    except Exception as e:
        jobs[job_id] = {"status": "error", "error": str(e)}
        logger.error("Speedtest job %s failed: %s", job_id, e)


def create_speedtest_job(db_session_factory=None) -> str:
    job_id = str(uuid.uuid4())
    asyncio.create_task(run_speedtest_job(job_id, db_session_factory))
    return job_id


def get_job_status(job_id: str) -> dict | None:
    return jobs.get(job_id)
