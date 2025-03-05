import logging
from typing import Dict, List
from services.file_processors import FileProcessor
from services.openai_analyzer import ContentAnalyzer
from services.s3_service import S3Service
from core.config import settings

logger = logging.getLogger(__name__)

class FileProcessorService:
    def __init__(self):
        self.s3_service = S3Service()
        self.file_processor = FileProcessor()
        self.content_analyzer = ContentAnalyzer()

    async def process_file(self, filename: str, content: bytes, scan_images: bool = False) -> Dict[str, List[str]]:
        """
        Process a file based on its extension asynchronously.
        
        Args:
            filename: Name of the file to process
            content: Raw file content
            scan_images: Whether to perform OCR on images
            
        Returns:
            Dict containing extracted topics
        """
        extension = filename.split(".")[-1].lower()
        text = ""

        if extension == "pdf":
            text = await self.file_processor.extract_text_from_pdf(content, scan_images)
        elif extension in ["ppt", "pptx"]:
            text = await self.file_processor.extract_text_from_pptx(content, scan_images)
        elif extension in ["xls", "xlsx"]:
            text = await self.file_processor.extract_text_from_xlsx(content)
        else:
            logger.warning(f"Unsupported file type requested: {extension}")
            text = "Unsupported file type."

        # Extract topics using OpenAI
        topics = await self.content_analyzer.extract_topics(text)

        # Upload text content to S3
        text_filename = f"{filename.split('.')[0]}.txt"
        success = await self.s3_service.upload_file(
            bucket=settings.AWS_S3_EXERCISES_BUCKET,
            key=text_filename,
            content=text.encode('utf-8'),
            content_type='text/plain'
        )
        
        if not success:
            logger.error(f"Failed to upload text file to S3: {text_filename}")

        return {
            "topics": topics
        }

    async def get_file_from_s3(self, file_id: str) -> bytes:
        """
        Retrieve file content from S3
        
        Args:
            file_id: ID of the file to retrieve
            
        Returns:
            Raw file content
        """
        content = await self.s3_service.get_file(
            bucket=settings.AWS_S3_EXERCISES_BUCKET,
            key=file_id
        )
        if content is None:
            raise FileNotFoundError(f"File not found in S3: {file_id}")
        return content 