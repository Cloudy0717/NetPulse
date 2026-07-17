from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import system, network, ping, websocket, speedtest, traceroute, settings as settings_router, history
from .models.database import init_db
import logging

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    logger.info("Database initialized")
    yield


app = FastAPI(title="NetPulse API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system.router)
app.include_router(network.router)
app.include_router(ping.router)
app.include_router(websocket.router)
app.include_router(speedtest.router)
app.include_router(history.router)
app.include_router(traceroute.router)
app.include_router(settings_router.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
