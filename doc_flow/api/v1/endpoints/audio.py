from fastapi import APIRouter, Form, HTTPException
from typing import Dict

from ....core.logging import logger
from ....schemas.audio import AudioResponse
from ....services.audio_service import AudioService

router = APIRouter()

@router.post("/generate-audio", response_model=AudioResponse)
async def generate_audio(
    exerciseId: str = Form(...),
    generate_text: str = Form(...)
) -> Dict:
    try:
        audio_service = AudioService()
        result = await audio_service.generate_and_process_audio(exerciseId, generate_text)
        return result
    
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while processing the request",
                "error": str(e),
                "type": type(e).__name__
            }
        ) 