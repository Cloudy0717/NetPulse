import socket
import asyncio
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

ALLOWED_PREFIXES = ("127.", "192.168.", "10.", "172.16.", "172.17.", "172.18.", "172.19.", "172.20.", "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31.")
MAX_PORTS = 100

def is_safe_target(host: str) -> bool:
    if host in ("localhost", "127.0.0.1", "0.0.0.0"):
        return True
    return host.startswith(ALLOWED_PREFIXES)

async def scan_port(host: str, port: int, timeout: float = 1.0) -> dict:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return {"port": port, "open": result == 0}
    except Exception as e:
        return {"port": port, "open": False, "error": str(e)}

async def scan_ports(host: str, start_port: int = 1, end_port: int = 1024) -> List[Dict]:
    if not is_safe_target(host):
        raise ValueError(f"Scanning {host} is not allowed. Only local/private networks permitted.")

    port_count = end_port - start_port + 1
    if port_count > MAX_PORTS:
        raise ValueError(f"Cannot scan more than {MAX_PORTS} ports at once (requested {port_count}).")

    logger.info("Scanning %s ports %d-%d", host, start_port, end_port)
    tasks = [scan_port(host, port) for port in range(start_port, end_port + 1)]
    results = await asyncio.gather(*tasks)
    return [r for r in results if r["open"]]
