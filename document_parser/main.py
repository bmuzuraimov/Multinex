import logging
import os
from typing import Dict
import asyncio

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from file_processors import FileProcessor
from openai_analyzer import ContentAnalyzer

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,https://typeit.up.railway.app")
allowed_origins = [origin.strip() for origin in ALLOWED_ORIGINS.split(",")]

app = FastAPI(
    title="File Text Extraction API",
    description="A service to extract text from PDF, PPTX, and XLSX files, including OCR on images.",
    version="1.0.0",
    docs_url=None,
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


async def process_file(filename: str, content: bytes, scan_images: bool = False) -> Dict[str, str]:
    """
    Process a file based on its extension asynchronously.
    """
    extension = filename.split(".")[-1].lower()
    text = ""
    processor = FileProcessor()

    if extension == "pdf":
        text = await processor.extract_text_from_pdf(content, scan_images)
    elif extension in ["ppt", "pptx"]:
        text = await processor.extract_text_from_pptx(content, scan_images)
    elif extension in ["xls", "xlsx"]:
        text = await processor.extract_text_from_xlsx(content)
    else:
        logger.warning(f"Unsupported file type requested: {extension}")
        text = "Unsupported file type."

    # Extract topics using OpenAI
    analyzer = ContentAnalyzer()
    topics = await analyzer.extract_topics(text)

    return {
        "filename": filename,
        "text": text,
        "topics": topics
    }


@app.post("/extract-text")
async def extract_text(
    file: UploadFile = File(...),
    scan_images: bool = False,
    user_id: str = None
) -> JSONResponse:
    filename = file.filename
    logger.info(f"Processing file: {filename} for user: {user_id}")

    start_time = asyncio.get_event_loop().time()

    try:
        content = await file.read()
    except Exception as e:
        logger.exception("File reading error")
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

    results = await process_file(filename, content, scan_images)
    
    end_time = asyncio.get_event_loop().time()
    execution_time = end_time - start_time
    logger.info(f"Processing completed in {execution_time:.2f} seconds")
    return JSONResponse(content=results)


@app.get("/")
def read_root() -> Dict[str, str]:
    return {
        "message": "Welcome to the File Text Extraction API. Use the /extract-text endpoint to upload files."
    }