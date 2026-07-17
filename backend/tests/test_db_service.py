import pytest
from app.services.db_service import save_speedtest, get_speedtest_history, save_ping_record, get_ping_history


@pytest.mark.asyncio
async def test_save_and_retrieve_speedtest(db_session):
    result = await save_speedtest(db_session, download_mbps=100.5, upload_mbps=20.3, latency_ms=15.0, server="Test Server")
    assert result.id is not None
    assert result.download_mbps == 100.5

    history = await get_speedtest_history(db_session, limit=10)
    assert len(history) >= 1
    assert history[0].download_mbps == 100.5


@pytest.mark.asyncio
async def test_save_and_retrieve_ping(db_session):
    result = await save_ping_record(db_session, host="google.com", latency_ms=15.2, status="online")
    assert result.id is not None
    assert result.host == "google.com"

    history = await get_ping_history(db_session, host="google.com")
    assert len(history) >= 1
