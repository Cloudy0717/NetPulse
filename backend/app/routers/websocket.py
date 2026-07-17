from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
import asyncio
import psutil
import time
import logging
from ..services.ping_service import ping_host
from ..services.notification_service import check_alerts
from ..services.db_service import save_ping_record
from ..models.database import async_session
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/live")
async def ws_live(websocket: WebSocket, host: str = Query(default=None)):
    await websocket.accept()
    ping_target = host or settings.default_ping_host
    logger.info("WebSocket connected, ping target: %s", ping_target)

    prev_traffic = psutil.net_io_counters()
    prev_ts = time.time()
    alert_cooldown = {}

    try:
        first = True
        while True:
            now_ts = time.time()
            interval = now_ts - prev_ts

            system_data = {
                "cpu_percent": psutil.cpu_percent(interval=0.1),
                "ram_percent": psutil.virtual_memory().percent,
                "disk_percent": psutil.disk_usage("/").percent,
            }

            curr_traffic = psutil.net_io_counters()
            if first:
                first = False
                prev_traffic = curr_traffic
                prev_ts = now_ts
                sent_diff = 0
                recv_diff = 0
            else:
                sent_diff = curr_traffic.bytes_sent - prev_traffic.bytes_sent
                recv_diff = curr_traffic.bytes_recv - prev_traffic.bytes_recv
                prev_traffic = curr_traffic
                prev_ts = now_ts
            traffic_data = {
                "upload_mbps": round((sent_diff * 8) / 1_000_000 / interval, 2) if interval > 0 else 0,
                "download_mbps": round((recv_diff * 8) / 1_000_000 / interval, 2) if interval > 0 else 0,
                "packets_sent": curr_traffic.packets_sent,
                "packets_recv": curr_traffic.packets_recv,
            }

            ping_data = ping_host(ping_target)

            # Save ping to DB (fire-and-forget, non-blocking)
            try:
                async with async_session() as db_session:
                    await save_ping_record(
                        db_session,
                        host=ping_data["host"],
                        latency_ms=ping_data.get("latency_ms"),
                        status=ping_data["status"],
                    )
            except Exception:
                logger.exception("Failed to save ping record to DB")

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
