import psutil
import socket
import requests
import subprocess
import platform
import logging

logger = logging.getLogger(__name__)

_VIRTUAL_PREFIXES = ("vmnet", "vether", "vbox", "docker", "br-", "veth", "lo")


def _is_physical(name: str) -> bool:
    return not name.lower().startswith(_VIRTUAL_PREFIXES)


def get_network_info() -> dict:
    logger.debug("Fetching network info")
    stats = psutil.net_if_stats()
    addrs = psutil.net_if_addrs()

    interface_name = "Unknown"
    interface_status = "Down"
    ipv4 = "Unknown"
    mac_address = "Unknown"

    candidates = [name for name, s in stats.items() if s.isup and name != "lo"]
    physical = [n for n in candidates if _is_physical(n)]
    chosen = physical[0] if physical else (candidates[0] if candidates else None)

    if chosen and chosen in stats:
        interface_name = chosen
        interface_status = "Up" if stats[chosen].isup else "Down"
        if chosen in addrs:
            for addr in addrs[chosen]:
                if addr.family == socket.AF_INET:
                    ipv4 = addr.address
                elif addr.family == psutil.AF_LINK:
                    mac_address = addr.address

    try:
        result = subprocess.run(["ipconfig"], capture_output=True, text=True)
        gateway = "Unknown"
        for line in result.stdout.split("\n"):
            if "Default Gateway" in line and ":" in line:
                gateway = line.split(":")[-1].strip()
                if gateway:
                    break
    except Exception:
        gateway = "Unknown"

    try:
        dns = socket.gethostbyname("google.com")
    except Exception:
        dns = "Unknown"

    try:
        public_ip = requests.get("https://api.ipify.org", timeout=5).text
    except Exception:
        public_ip = "Unknown"

    return {
        "ipv4": ipv4,
        "ipv6": "N/A",
        "mac_address": mac_address,
        "gateway": gateway,
        "dns": dns,
        "public_ip": public_ip,
        "interface_name": interface_name,
        "interface_status": interface_status,
    }
