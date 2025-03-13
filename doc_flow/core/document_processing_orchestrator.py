import logging
from typing import Dict, List
from core.document_content_extractor import FileProcessor
from services.openai_service import openai_service
from services.s3_service import s3_service
from core.config import settings
from fastapi import HTTPException
logger = logging.getLogger(__name__)

class FileProcessorService:
    def __init__(self):
        self.file_processor = FileProcessor()
        self.openai_service = openai_service
        self.s3_service = s3_service

    async def processFile(self, filename: str, content: bytes, scan_images: bool = False) -> Dict[str, List[str]]:
        """
        Process a file based on its extension asynchronously.
        
        Args:
            filename: Name of the file to process
            content: Raw file content
            scan_images: Whether to perform OCR on images
            
        Returns:
            Dict containing extracted topics
        """
        file_extension = filename.split(".")[-1].lower()
        extracted_text = ""

        if file_extension == "pdf":
            extracted_text = await self.file_processor.extractTextFromPdf(content, scan_images)
        elif file_extension in ["ppt", "pptx"]:
            extracted_text = await self.file_processor.extractTextFromPptx(content, scan_images)
        elif file_extension in ["xls", "xlsx"]:
            extracted_text = await self.file_processor.extractTextFromXlsx(content)
        else:
            logger.warning(f"Unsupported file type requested: {file_extension}")
            extracted_text = "Unsupported file type."

        # Extract topics using OpenAI
        extracted_topics = await self.openai_service.extractTopics(extracted_text)

        # Upload text content to S3
        text_filename = f"{filename.split('.')[0]}.txt"
        upload_success = await self.s3_service.uploadFile(
            key=text_filename,
            content=extracted_text.encode('utf-8'),
            content_type='text/plain'
        )
        
        if not upload_success:
            logger.error(f"Failed to upload text file to S3: {text_filename}")

        return extracted_topics

    async def getFileFromS3(self, file_id: str) -> bytes:
        """
        Retrieve file content from S3
        
        Args:
            file_id: ID of the file to retrieve
            
        Returns:
            Raw file content
        """
        file_content = await self.s3_service.getFile(
            key=file_id
        )
        if file_content is None:
            raise HTTPException(status_code=404, detail=f"File not found in S3: {file_id}")
        return file_content