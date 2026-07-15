import psutil
import socket
import requests
import subprocess
import platform
import logging

logger = logging.getLogger(__name__)


def get_network_info() -> dict:
    logger.debug("Fetching network info")
    stats = psutil.net_if_stats()
    addrs = psutil.net_if_addrs()

    interface_name = "Unknown"
    interface_status = "Down"
    ipv4 = "Unknown"
    mac_address = "Unknown"

    for name, stat in stats.items():
        if stat.isup and name != "lo":
            interface_name = name
            interface_status = "Up"
            if name in addrs:
                for addr in addrs[name]:
                    if addr.family == socket.AF_INET:
                        ipv4 = addr.address
                    elif addr.family == psutil.AF_LINK:
                        mac_address = addr.address
            break

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
