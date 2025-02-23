from fastapi import APIRouter
from .endpoints import document, audio

api_router = APIRouter()

api_router.include_router(document.router, prefix="/documents", tags=["documents"])
api_router.include_router(audio.router, prefix="/audio", tags=["audio"]) 