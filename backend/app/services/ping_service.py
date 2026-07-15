from ping3 import ping
import logging

logger = logging.getLogger(__name__)


def ping_host(host: str) -> dict:
    logger.debug("Pinging %s", host)
    try:
        latency = ping(host, timeout=5)
        if latency is not None:
            return {
                "host": host,
                "latency_ms": round(latency * 1000, 2),
                "status": "online",
            }
        else:
            return {
                "host": host,
                "latency_ms": None,
                "status": "timeout",
            }
    except Exception as e:
        logger.error("Ping error for %s: %s", host, e)
        return {
            "host": host,
            "latency_ms": None,
            "status": "error",
            "error": str(e),
        }
