from fastapi import APIRouter, Query
from ..services.ping_service import ping_host

router = APIRouter(prefix="/api", tags=["ping"])


@router.get("/ping")
async def ping(host: str = Query(default="google.com")):
    return ping_host(host)
