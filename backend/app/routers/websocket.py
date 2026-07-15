from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
import asyncio
import psutil
import time
import logging
from ..services.ping_service import ping_host
from ..services.notification_service import check_alerts
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/live")
async def ws_live(websocket: WebSocket, host: str = Query(default=None)):
    await websocket.accept()
    ping_target = host or settings.default_ping_host
    logger.info("WebSocket connected, ping target: %s", ping_target)

    prev_traffic = psutil.net_io_counters()
    alert_cooldown = {}

    try:
        while True:
            system_data = {
                "cpu_percent": psutil.cpu_percent(interval=0.1),
                "ram_percent": psutil.virtual_memory().percent,
                "disk_percent": psutil.disk_usage("/").percent,
            }

            curr_traffic = psutil.net_io_counters()
            traffic_data = {
                "upload_mbps": round(
                    (curr_traffic.bytes_sent - prev_traffic.bytes_sent) / 1024 / 1024, 2
                ),
                "download_mbps": round(
                    (curr_traffic.bytes_recv - prev_traffic.bytes_recv) / 1024 / 1024, 2
                ),
                "packets_sent": curr_traffic.packets_sent,
                "packets_recv": curr_traffic.packets_recv,
            }
            prev_traffic = curr_traffic

            ping_data = ping_host(ping_target)

            now = time.time()
            alerts = check_alerts(system_data, ping_data)
            filtered_alerts = []
            for alert in alerts:
                last_time = alert_cooldown.get(alert["type"], 0)
                if now - last_time > 5:
                    filtered_alerts.append(alert)
                    alert_cooldown[alert["type"]] = now

            await websocket.send_json(
                {
                    "type": "live",
                    "data": {
                        "system": system_data,
                        "traffic": traffic_data,
                        "ping": ping_data,
                        "alerts": filtered_alerts,
                    },
                    "timestamp": now,
                }
            )

            await asyncio.sleep(settings.refresh_rate)
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
