from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SpeedTestCreate(BaseModel):
    download_mbps: float
    upload_mbps: float
    latency_ms: Optional[float] = None
    server: Optional[str] = None


class SpeedTestResponse(SpeedTestCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PingRecordCreate(BaseModel):
    host: str
    latency_ms: Optional[float] = None
    status: str


class PingRecordResponse(PingRecordCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

