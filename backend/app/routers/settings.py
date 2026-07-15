from fastapi import APIRouter
from pydantic import BaseModel
import json
from pathlib import Path
from ..config import settings

router = APIRouter(prefix="/api", tags=["settings"])

from pathlib import Path

SETTINGS_FILE = Path(__file__).resolve().parent.parent.parent.parent / "data" / "settings.json"

DEFAULT_SETTINGS = {
    "refresh_rate": settings.refresh_rate,
    "theme": "dark",
    "ping_target": settings.default_ping_host,
    "notifications_enabled": True,
}


def load_settings() -> dict:
    if SETTINGS_FILE.exists():
        with open(SETTINGS_FILE, "r") as f:
            return json.load(f)
    return DEFAULT_SETTINGS.copy()


def save_settings(data: dict):
    SETTINGS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(SETTINGS_FILE, "w") as f:
        json.dump(data, f, indent=2)


class SettingsUpdate(BaseModel):
    refresh_rate: int | None = None
    theme: str | None = None
    ping_target: str | None = None
    notifications_enabled: bool | None = None


@router.get("/settings")
async def get_settings():
    return load_settings()


@router.put("/settings")
async def update_settings(update: SettingsUpdate):
    current = load_settings()
    if update.refresh_rate is not None:
        current["refresh_rate"] = update.refresh_rate
    if update.theme is not None:
        current["theme"] = update.theme
    if update.ping_target is not None:
        current["ping_target"] = update.ping_target
    if update.notifications_enabled is not None:
        current["notifications_enabled"] = update.notifications_enabled
    save_settings(current)
    return current
