from pydantic import BaseModel
from typing import List, Optional, Dict

class DocumentResponse(BaseModel):
    status: str
    filename: str
    text: str
    topics: List[str]
    error: Optional[Dict] = None

class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
    error_code: Optional[int] = None
    error_type: Optional[str] = None 