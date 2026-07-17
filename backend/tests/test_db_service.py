import pytest
from app.models.database import async_session, engine
from app.models.models import Base
from app.services.db_service import save_speedtest, get_speedtest_history, save_ping_record, get_ping_history


@pytest.mark.asyncio
async def test_save_and_retrieve_speedtest():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        result = await save_speedtest(session, download_mbps=100.5, upload_mbps=20.3, latency_ms=15.0, server="Test Server")
        assert result.id is not None
        assert result.download_mbps == 100.5

    async with async_session() as session:
        history = await get_speedtest_history(session, limit=10)
        assert len(history) >= 1
        assert history[0].download_mbps == 100.5


@pytest.mark.asyncio
async def test_save_and_retrieve_ping():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        result = await save_ping_record(session, host="google.com", latency_ms=15.2, status="online")
        assert result.id is not None
        assert result.host == "google.com"

    async with async_session() as session:
        history = await get_ping_history(session, host="google.com")
        assert len(history) >= 1
