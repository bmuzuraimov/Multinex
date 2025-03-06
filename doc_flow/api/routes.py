from fastapi import APIRouter, HTTPException, Form, Depends
from fastapi.responses import JSONResponse
import logging
from typing import Dict, Union
import re

from services.file_processor_service import FileProcessorService
from services.audio_handler import AudioHandler
from schemas.api import (
    ExerciseTopicsRequest,
    ExerciseTopicsResponse,
    AudioGenerationRequest,
    AudioGenerationResponse,
    ErrorResponse
)
from services.database_service import DatabaseService
from services.openai_analyzer import OpenAIAPIError

logger = logging.getLogger(__name__)

router = APIRouter()
file_processor = FileProcessorService()
audio_handler = AudioHandler()
db_service = DatabaseService()

def validate_file_id(file_id: str) -> str:
    """Validate file ID format"""
    if not re.match(r'^[a-zA-Z0-9-_]+$', file_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid file ID format. Only alphanumeric characters, hyphens, and underscores are allowed."
        )
    return file_id

def validate_file_type(file_type: str) -> str:
    """Validate file type"""
    allowed_types = ["pdf", "ppt", "pptx", "xls", "xlsx"]
    if file_type.lower() not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed types are: {', '.join(allowed_types)}"
        )
    return file_type.lower()

@router.post("/get-exercise-topics", response_model=Union[ExerciseTopicsResponse, ErrorResponse])
async def get_exercise_topics(
    fileId: str = Form(...),
    fileType: str = Form(...)
) -> Union[ExerciseTopicsResponse, ErrorResponse]:
    """
    Extract topics from a document file.
    
    Args:
        fileId: Unique identifier for the file
        fileType: Type of the file (pdf, ppt, pptx, xls, xlsx)
        
    Returns:
        List of extracted topics or error response
    """
    try:
        # Validate inputs
        file_id = validate_file_id(fileId)
        file_type = validate_file_type(fileType)
        
        # Get file content
        file_content = await file_processor.get_file_from_s3(file_id)
        
        # Process file
        file_name = f"{file_id}.{file_type}"
        results = await file_processor.process_file(file_name, file_content)
        
        return ExerciseTopicsResponse(**results)
    except FileNotFoundError as e:
        logger.error(f"File not found: {str(e)}")
        return JSONResponse(
            status_code=404,
            content=ErrorResponse(
                success=False,
                message=f"File not found: {str(e)}"
            ).dict()
        )
    except OpenAIAPIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return JSONResponse(
            status_code=e.http_status,
            content=ErrorResponse(
                success=False,
                message=e.message
            ).dict()
        )
    except Exception as e:
        logger.exception("Error processing file")
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                success=False,
                message="An unexpected error occurred while processing your request."
            ).dict()
        )

@router.post("/generate-audio", response_model=AudioGenerationResponse)
async def generate_audio(
    exerciseId: str = Form(...),
    generate_text: str = Form(...)
) -> AudioGenerationResponse:
    """
    Generate audio from text with word-level timestamps.
    
    Args:
        exerciseId: Unique identifier for the exercise
        generate_text: Text to convert to audio
        
    Returns:
        Audio data and word-level timestamps
    """
    try:
        # Validate inputs
        exercise_id = validate_file_id(exerciseId)
        if not generate_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Text content cannot be empty"
            )
            
        result = await audio_handler.generate_audio(exercise_id, generate_text)
        return AudioGenerationResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error generating audio")
        return AudioGenerationResponse(
            success=False,
            message=str(e)
        )

@router.get("/")
def read_root() -> Dict[str, str]:
    """Root endpoint returning API information"""
    return {
        "message": "Welcome to the File Text Extraction API",
        "version": "1.0.0",
        "status": "operational"
    } 