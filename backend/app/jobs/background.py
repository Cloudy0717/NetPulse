import asyncio
import uuid
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)

jobs: dict[str, dict] = {}

async def run_speedtest_job(job_id: str, db_session_factory=None):
    logger.info("Starting speedtest job: %s", job_id)
    jobs[job_id] = {"status": "running", "result": None}

    try:
        import speedtest
        st = speedtest.Speedtest()
        st.get_best_server()

        download = st.download() / 1_000_000
        upload = st.upload() / 1_000_000
        latency = st.results.ping

        server_info = getattr(st.results, 'server', {})
        server_name = server_info.get('sponsor', 'Unknown') if isinstance(server_info, dict) else str(st.best_host)

        result = {
            "download_mbps": round(download, 2),
            "upload_mbps": round(upload, 2),
            "latency_ms": round(latency, 2),
            "server": server_name,
        }

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
