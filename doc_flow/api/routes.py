from fastapi import APIRouter, HTTPException, Body, Form
import logging
from typing import Dict
import re

from core.document_processing_orchestrator import FileProcessorService
from services.elevenlabs_service import elevenlabs_service
from services.db_service import db_service

logger = logging.getLogger(__name__)

router = APIRouter()
file_processor = FileProcessorService()


def validateFileId(file_id: str) -> str:
    """Validate file ID format"""
    if not re.match(r'^[a-zA-Z0-9-_]+$', file_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid file ID format. Only alphanumeric characters, hyphens, and underscores are allowed."
        )
    return file_id


def validateFileType(file_type: str) -> str:
    """Validate file type"""
    ALLOWED_TYPES = ["pdf", "ppt", "pptx", "xls", "xlsx"]
    if file_type.lower() not in ALLOWED_TYPES:
        raise Exception(
            f"Invalid file type: {file_type}, allowed types: {ALLOWED_TYPES}")
    return file_type.lower()


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
        # Validate inputs
        validated_file_id = validateFileId(file_id)
        validated_file_type = validateFileType(file_type)

        # Get file content
        file_content = await file_processor.getFileFromS3(validated_file_id)

        # Process file
        file_name = f"{validated_file_id}.{validated_file_type}"
        topics = await file_processor.processFile(file_name, file_content)

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
def getRoot() -> Dict[str, str]:
    """Root endpoint"""
    return {
        "success": True,
        "code": 200,
        "message": "API is running",
        "data": {"version": "1.0.0"}
    }
