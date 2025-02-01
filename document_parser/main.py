import logging
import os
from typing import Dict
import asyncio

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from file_processors import FileProcessor
from openai_analyzer import ContentAnalyzer
from pydantic import BaseModel
from elevenlabs.client import ElevenLabs
import base64
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import boto3
import json
import re
import traceback
from pydantic import BaseModel
from fastapi import Body
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


class AudioRequest(BaseModel):
    exerciseId: str
    generate_text: str


ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS", "http://localhost:3000,https://typeit.up.railway.app,http://localhost:3001")
allowed_origins = [origin.strip() for origin in ALLOWED_ORIGINS.split(",")]

# Database configuration
# Update with your DB credentials
DATABASE_URL = os.environ.get("DATABASE_URL", None)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_S3_IAM_ACCESS_KEY'),
    aws_secret_access_key=os.environ.get('AWS_S3_IAM_SECRET_KEY'),
    region_name=os.environ.get('AWS_S3_REGION')
)

# Initialize ElevenLabs client
elevenlabs_client = ElevenLabs(api_key=os.environ.get("ELEVENLABS_API_KEY"))

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
        raise HTTPException(
            status_code=500, detail=f"Error reading file: {str(e)}")

    results = await process_file(filename, content, scan_images)

    end_time = asyncio.get_event_loop().time()
    execution_time = end_time - start_time
    logger.info(f"Processing completed in {execution_time:.2f} seconds")
    return JSONResponse(content=results)


@app.post("/generate-audio")
async def generate_audio(
    exerciseId: str = Form(...),
    generate_text: str = Form(...)
) -> Dict:
    try:
        if not generate_text or not exerciseId:
            raise HTTPException(
                status_code=422,
                detail="Missing required fields: generate_text and exerciseId are required"
            )

        filtered_text = generate_text
        filtered_text = re.findall(r'<hear>(.*?)</hear>', filtered_text)
        filtered_text = ' '.join(filtered_text)
        filtered_text = re.sub(r'\n{2,}', '', filtered_text.strip())
        filtered_text = re.sub(r' +', ' ', filtered_text)
        # Generate audio with timestamps
        response = elevenlabs_client.text_to_speech.convert_with_timestamps(
            voice_id="JBFqnCBsd6RMkjVDRZzb",
            output_format="mp3_22050_32",
            text=filtered_text,
            model_id="eleven_multilingual_v2"
        )

        # Extract word-level timestamps
        timestamps = []
        current_word = ""
        word_start = 0

        chars = response["normalized_alignment"]["characters"]
        starts = response["normalized_alignment"]["character_start_times_seconds"]
        ends = response["normalized_alignment"]["character_end_times_seconds"]

        for i in range(len(chars)):
            char = chars[i]

            if char.isspace():
                if current_word:
                    timestamps.append({
                        "word": current_word,
                        "start": word_start,
                        "end": ends[i - 1]
                    })
                    current_word = ""
            else:
                if not current_word:
                    word_start = starts[i]
                current_word += char

        if current_word:
            timestamps.append({
                "word": current_word,
                "start": word_start,
                "end": ends[-1]
            })

        # Upload to S3
        bucket_name = os.environ.get('AWS_S3_FILES_BUCKET')
        s3_key = f"{exerciseId}.mp3"

        # Upload decoded audio data directly to S3
        audio_data = base64.b64decode(response["audio_base64"])
        s3_client.put_object(
            Bucket=bucket_name,
            Key=s3_key,
            Body=audio_data
        )

        # Update database
        db = SessionLocal()
        try:
            # Convert timestamps array to JSON string for storage
            audio_timestamps = [str(json.dumps(word_object)) for word_object in timestamps]
            # Update Exercise table with audioTimestamps
            query = text("""
                UPDATE "public"."Exercise" 
                SET "audioTimestamps" = :timestamps
                WHERE id = :exercise_id
            """)

            db.execute(query, {
                "timestamps": audio_timestamps,
                "exercise_id": exerciseId,
            })

            # Insert file record
            file_query = text("""
                INSERT INTO "public"."File" (id, "createdAt", "exerciseId", name, type, key, "uploadUrl")
                VALUES (gen_random_uuid(), NOW(), :exercise_id, :name, :type, :key, :upload_url)
            """)

            db.execute(file_query, {
                "exercise_id": exerciseId,
                "name": str(exerciseId),
                "type": "audio/mpeg",
                "key": s3_key,
                "upload_url": f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
            })

            db.commit()

            return {
                "status": "success",
                "timestamps": timestamps,
                "audioUrl": f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
            }

        finally:
            db.close()

    except Exception as e:
        print(f"Error details: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error traceback:")
        traceback.print_exc()
        
        # Log the error details
        logging.error(f"Error occurred: {str(e)}", exc_info=True)
        
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while processing the request",
                "error": str(e),
                "type": type(e).__name__,
                "traceback": traceback.format_exc()
            }
        )


@app.get("/")
def read_root() -> Dict[str, str]:
    return {
        "message": "Welcome to the File Text Extraction API. Use the /extract-text endpoint to upload files."
    }
