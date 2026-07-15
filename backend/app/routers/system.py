from fastapi import APIRouter
from ..services.system_info import get_system_info

router = APIRouter(prefix="/api", tags=["system"])


@router.get("/system")
async def system():
    return get_system_info()
