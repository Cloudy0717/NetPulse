import sys
import os
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


@pytest_asyncio.fixture
async def db_session():
    test_engine = create_async_engine("sqlite+aiosqlite://", echo=False)
    test_session_factory = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)

    from app.models.models import Base
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with test_session_factory() as session:
        yield session

    await test_engine.dispose()
