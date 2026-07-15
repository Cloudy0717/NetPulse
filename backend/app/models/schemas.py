from pydantic import BaseModel


class SystemInfo(BaseModel):
    hostname: str
    os: str
    cpu_model: str
    cpu_cores: int
    cpu_percent: float
    ram_total_gb: float
    ram_used_gb: float
    ram_percent: float
    disk_total_gb: float
    disk_used_gb: float
    disk_percent: float
    python_version: str


class NetworkInfo(BaseModel):
    ipv4: str
    ipv6: str
    mac_address: str
    gateway: str
    dns: str
    public_ip: str
    interface_name: str
    interface_status: str


class TrafficData(BaseModel):
    upload_mbps: float
    download_mbps: float
    packets_sent: int
    packets_recv: int


class PingData(BaseModel):
    host: str
    latency_ms: float | None
    status: str


class LiveUpdate(BaseModel):
    type: str
    data: dict
    timestamp: float
