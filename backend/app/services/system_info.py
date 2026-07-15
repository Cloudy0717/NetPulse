import psutil
import platform
import socket
import logging

logger = logging.getLogger(__name__)


def get_system_info() -> dict:
    logger.debug("Fetching system info")
    cpu_percent = psutil.cpu_percent(interval=0.1)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage("/")

    return {
        "hostname": socket.gethostname(),
        "os": f"{platform.system()} {platform.release()}",
        "cpu_model": platform.processor() or "Unknown",
        "cpu_cores": psutil.cpu_count(),
        "cpu_percent": cpu_percent,
        "ram_total_gb": round(ram.total / (1024**3), 2),
        "ram_used_gb": round(ram.used / (1024**3), 2),
        "ram_percent": ram.percent,
        "disk_total_gb": round(disk.total / (1024**3), 2),
        "disk_used_gb": round(disk.used / (1024**3), 2),
        "disk_percent": disk.percent,
        "python_version": platform.python_version(),
    }
