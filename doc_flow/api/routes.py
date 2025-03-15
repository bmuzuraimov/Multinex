from fastapi import APIRouter, HTTPException, Form
import logging
from typing import Dict, Any
import json
from services.doc_service import doc_service
from services.elevenlabs_service import elevenlabs_service
from services.db_service import db_service
from services.s3_service import s3_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/get-exercise-topics", response_model=dict)
async def getExerciseTopics(
    file_id: str = Form(...),
    file_type: str = Form(...)
) -> dict:
    """
    Extract topics from a document file.

    Accepts both JSON body and form data:
    - JSON body: {"file_id": "...", "file_type": "..."}
    - Form data: file_id=...&file_type=...

    Args:
        request: JSON request body
        file_id: File ID from form data
        file_type: File type from form data

    Returns:
        List of extracted topics or error response
    """
    try:
        # Get file content
        file_content = await s3_service.getFile(key=file_id)

        # Process file
        topics = await doc_service.processFile(file_id, file_content)

        return {
            "success": True,
            "code": 200,
            "message": "Topics extracted successfully",
            "data": topics
        }
    except HTTPException as e:
        return {
            "success": False,
            "code": e.status_code,
            "message": e.detail,
        }


@router.post("/generate-audio", response_model=dict)
async def generateAudio(
    exercise_id: str = Form(...),
    generate_text: str = Form(...)
) -> dict:
    """
    Generate audio from text for an exercise.

    Args:
        exercise_id: Exercise ID
        generate_text: Text to generate audio from

    Returns:
        Audio generation response with URL to the generated audio file
    """
    try:
        # Validate exercise ID
        if not db_service.exercise_exists(exercise_id):
            raise HTTPException(
                status_code=404,
                detail=f"Exercise with ID {exercise_id} not found"
            )

        # Generate audio
        await elevenlabs_service.generateAudio(exercise_id, generate_text)

        return {
            "success": True,
            "code": 200,
            "message": "Audio generated successfully",
        }
    except HTTPException as e:
        return {
            "success": False,
            "code": e.status_code,
            "message": e.detail,
        }


@router.get("/")
def getRoot() -> Dict[str, Any]:
    """Root endpoint"""
    return {
        "success": True,
        "code": 200, 
        "message": "API is running",
        "data": json.dumps({"version": "1.0.0"})
    }
