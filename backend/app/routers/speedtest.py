from fastapi import APIRouter
from ..jobs.background import create_speedtest_job, get_job_status

router = APIRouter(prefix="/api", tags=["speedtest"])


@router.post("/speedtest")
async def start_speedtest():
    job_id = create_speedtest_job()
    return {"job_id": job_id, "status": "running"}


@router.get("/speedtest/{job_id}")
async def speedtest_status(job_id: str):
    job = get_job_status(job_id)
    if job is None:
        return {"status": "not_found"}
    return job
