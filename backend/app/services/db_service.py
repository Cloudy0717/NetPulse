from typing import Optional, List
from datetime import datetime
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import SpeedTest, PingRecord


async def save_speedtest(
    session: AsyncSession,
    download_mbps: float,
    upload_mbps: float,
    latency_ms: Optional[float] = None,
    server: Optional[str] = None,
) -> SpeedTest:
    record = SpeedTest(
        download_mbps=download_mbps,
        upload_mbps=upload_mbps,
        latency_ms=latency_ms,
        server=server,
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record


async def get_speedtest_history(
    session: AsyncSession,
    limit: int = 50,
    offset: int = 0,
) -> List[SpeedTest]:
    stmt = (
        select(SpeedTest)
        .order_by(desc(SpeedTest.created_at))
        .limit(limit)
        .offset(offset)
    )
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def save_ping_record(
    session: AsyncSession,
    host: str,
    latency_ms: Optional[float],
    status: str,
) -> PingRecord:
    record = PingRecord(host=host, latency_ms=latency_ms, status=status)
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record


async def get_ping_history(
    session: AsyncSession,
    host: Optional[str] = None,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    limit: int = 100,
    offset: int = 0,
) -> List[PingRecord]:
    stmt = select(PingRecord)
    if host:
        stmt = stmt.where(PingRecord.host == host)
    if start:
        stmt = stmt.where(PingRecord.created_at >= start)
    if end:
        stmt = stmt.where(PingRecord.created_at <= end)
    stmt = stmt.order_by(desc(PingRecord.created_at)).limit(limit).offset(offset)
    result = await session.execute(stmt)
    return list(result.scalars().all())
