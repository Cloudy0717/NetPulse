from fastapi import APIRouter
from pydantic import BaseModel
import subprocess
import platform
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["traceroute"])


class TracerouteRequest(BaseModel):
    host: str


@router.post("/traceroute")
async def traceroute(req: TracerouteRequest):
    logger.info("Traceroute to %s", req.host)
    try:
        cmd = "tracert" if platform.system() == "Windows" else "traceroute"
        result = subprocess.run(
            [cmd, "-d", req.host],
            capture_output=True,
            text=True,
            timeout=30,
        )

        hops = []
        for line in result.stdout.split("\n"):
            if line.strip() and line[0].isdigit():
                parts = line.split()
                if len(parts) >= 2:
                    hops.append(
                        {
                            "hop": int(parts[0]),
                            "ip": parts[1] if parts[1] != "*" else "Request timed out",
                        }
                    )

        return {"host": req.host, "hops": hops}
    except subprocess.TimeoutExpired:
        return {"host": req.host, "hops": [], "error": "Timeout"}
    except Exception as e:
        logger.error("Traceroute error: %s", e)
        return {"host": req.host, "hops": [], "error": str(e)}
