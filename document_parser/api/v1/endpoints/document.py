from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from typing import Optional
import asyncio

from ....core.logging import logger
from ....schemas.document import DocumentResponse
from ....services.document_service import DocumentService

router = APIRouter()

@router.post("/extract-text", response_model=DocumentResponse)
async def extract_text(
    file: UploadFile = File(...),
    scan_images: bool = False,
    user_id: Optional[str] = None
) -> JSONResponse:
    filename = file.filename
    logger.info(f"Processing file: {filename} for user: {user_id}")

    start_time = asyncio.get_event_loop().time()
    
    document_service = DocumentService()
    result = await document_service.process_file(file, scan_images)
    
    end_time = asyncio.get_event_loop().time()
    logger.info(f"Processing completed in {end_time - start_time:.2f} seconds")
    
    return JSONResponse(
        status_code=200 if result["status"] == "success" else 400,
        content=result
    ) 