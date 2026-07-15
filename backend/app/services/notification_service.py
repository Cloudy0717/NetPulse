import logging

logger = logging.getLogger(__name__)


def check_alerts(system_data: dict, ping_data: dict) -> list[dict]:
    new_alerts = []

    if system_data.get("cpu_percent", 0) > 90:
        alert = {
            "type": "cpu_high",
            "message": f"High CPU: {system_data['cpu_percent']}%",
            "severity": "warning",
        }
        new_alerts.append(alert)
        logger.warning("CPU alert triggered: %s%%", system_data["cpu_percent"])

    if system_data.get("ram_percent", 0) > 85:
        alert = {
            "type": "ram_high",
            "message": f"High RAM: {system_data['ram_percent']}%",
            "severity": "warning",
        }
        new_alerts.append(alert)
        logger.warning("RAM alert triggered: %s%%", system_data["ram_percent"])

    if ping_data and ping_data.get("status") == "timeout":
        alert = {
            "type": "ping_timeout",
            "message": f"Ping timeout to {ping_data.get('host', 'unknown')}",
            "severity": "error",
        }
        new_alerts.append(alert)
        logger.error("Ping timeout: %s", ping_data.get("host"))

    return new_alerts
