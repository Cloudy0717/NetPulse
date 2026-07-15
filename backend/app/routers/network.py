from fastapi import APIRouter
from ..services.network_info import get_network_info

router = APIRouter(prefix="/api", tags=["network"])


@router.get("/network")
async def network():
    return get_network_info()
