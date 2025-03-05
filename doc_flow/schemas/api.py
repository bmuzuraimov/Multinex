from pydantic import BaseModel
from typing import List, Dict, Optional

class ExerciseTopicsRequest(BaseModel):
    fileId: str
    fileType: str

class ExerciseTopicsResponse(BaseModel):
    topics: List[str]

class AudioGenerationRequest(BaseModel):
    exerciseId: str
    generate_text: str

class AudioGenerationResponse(BaseModel):
    success: bool
    timestamps: Optional[List[Dict[str, float]]] = None
    audio: Optional[str] = None
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str 