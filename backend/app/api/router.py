from fastapi import APIRouter
from app.api.endpoints import academic, security, user

api_router = APIRouter()
api_router.include_router(academic.router, prefix="/academic", tags=["academic"])
api_router.include_router(security.router, prefix="/security", tags=["security"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
