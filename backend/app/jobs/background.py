import asyncio
import uuid
import logging
from typing import Any

logger = logging.getLogger(__name__)

jobs: dict[str, dict] = {}


async def run_speedtest_job(job_id: str):
    logger.info("Starting speedtest job: %s", job_id)
    jobs[job_id] = {"status": "running", "result": None}

    try:
        import speedtest

        st = speedtest.Speedtest()
        st.get_best_server()

        download = st.download() / 1_000_000
        upload = st.upload() / 1_000_000
        latency = st.results.ping

        jobs[job_id] = {
            "status": "done",
            "result": {
                "download_mbps": round(download, 2),
                "upload_mbps": round(upload, 2),
                "latency_ms": round(latency, 2),
                "server": str(st.best_host),
            },
        }
        logger.info("Speedtest job %s completed", job_id)
    except Exception as e:
        jobs[job_id] = {"status": "error", "error": str(e)}
        logger.error("Speedtest job %s failed: %s", job_id, e)


def create_speedtest_job() -> str:
    job_id = str(uuid.uuid4())
    asyncio.create_task(run_speedtest_job(job_id))
    return job_id


def get_job_status(job_id: str) -> dict | None:
    return jobs.get(job_id)
