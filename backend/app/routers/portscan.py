from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ..services.port_scanner import scan_ports

router = APIRouter(prefix="/api", tags=["portscan"])

class PortScanRequest(BaseModel):
    host: str = Field(default="127.0.0.1")
    start_port: int = Field(default=1, ge=1, le=65535)
    end_port: int = Field(default=1024, ge=1, le=65535)

@router.post("/portscan")
async def portscan(req: PortScanRequest):
    try:
        open_ports = await scan_ports(req.host, req.start_port, req.end_port)
        return {"host": req.host, "open_ports": open_ports, "total": len(open_ports)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
