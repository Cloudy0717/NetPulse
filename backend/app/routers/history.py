from fastapi import APIRouter, Query, Depends
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.database import get_db
from app.services.db_service import get_speedtest_history, get_ping_history

router = APIRouter(prefix="/api/history", tags=["history"])

@router.get("/speed")
async def speed_history(
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0),
    db: AsyncSession = Depends(get_db),
):
    records = await get_speedtest_history(db, limit=limit, offset=offset)
    return {
        "records": [
            {
                "id": r.id,
                "download_mbps": r.download_mbps,
                "upload_mbps": r.upload_mbps,
                "latency_ms": r.latency_ms,
                "server": r.server,
                "created_at": r.created_at.isoformat(),
            }
            for r in records
        ],
    }

@router.get("/ping")
async def ping_history(
    host: str = Query(default=None),
    start: str = Query(default=None),
    end: str = Query(default=None),
    limit: int = Query(default=100, le=500),
    offset: int = Query(default=0),
    db: AsyncSession = Depends(get_db),
):
    start_dt = datetime.fromisoformat(start) if start else None
    end_dt = datetime.fromisoformat(end) if end else None
    records = await get_ping_history(db, host=host, start=start_dt, end=end_dt, limit=limit, offset=offset)
    return {
        "records": [
            {
                "id": r.id,
                "host": r.host,
                "latency_ms": r.latency_ms,
                "status": r.status,
                "created_at": r.created_at.isoformat(),
            }
            for r in records
        ],
    }
