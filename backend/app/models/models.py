from sqlalchemy import Column, Integer, Float, String, DateTime, func, Index
from .database import Base


class SpeedTest(Base):
    __tablename__ = "speed_tests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    download_mbps = Column(Float, nullable=False)
    upload_mbps = Column(Float, nullable=False)
    latency_ms = Column(Float, nullable=True)
    server = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)


class PingRecord(Base):
    __tablename__ = "ping_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    host = Column(String(255), nullable=False, index=True)
    latency_ms = Column(Float, nullable=True)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), index=True)

    __table_args__ = (
        Index("ix_ping_host_created", "host", "created_at"),
    )


class SystemMetric(Base):
    __tablename__ = "system_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpu_percent = Column(Float, nullable=False)
    ram_percent = Column(Float, nullable=False)
    disk_percent = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), index=True)
