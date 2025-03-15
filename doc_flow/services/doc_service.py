import logging
from typing import Dict, List, Optional
from services.openai_service import openai_service
from services.s3_service import s3_service
from core.config import settings
from fastapi import HTTPException
from tika import parser
from io import BytesIO
import re

logger = logging.getLogger(__name__)


class DocumentService:
    _instance: Optional['DocumentService'] = None
    _initialized: bool = False

    def __new__(cls) -> 'DocumentService':
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.openai_service = openai_service
            self.s3_service = s3_service
            self._initialized = True

    def _filter_urls(self, text: str) -> str:
        """
        Remove URLs from extracted text.

        This method removes:
        - Standard URLs starting with http:// or https://
        - URLs with common TLDs like .com, .org, etc
        - YouTube video URLs
        - arXiv paper URLs
        - Source attributions like "source: Stanford CS231n slides"

        Args:
            text: The extracted text containing URLs to filter

        Returns:
            Text with URLs removed and cleaned up
        """
        if not text or not isinstance(text, str):
            return ""

        try:
            # Remove standard URLs
            text = re.sub(
                r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)

            # Remove URLs with common TLDs
            text = re.sub(
                r'(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:/\S*)?', '', text)

            # Remove YouTube URLs
            text = re.sub(
                r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=[\w-]+', '', text)

            # Remove arXiv URLs
            text = re.sub(r'arxiv:\d{4}\.\d{4,5}', '', text)

            # Remove source attributions
            text = re.sub(r'source:\s*[^\n]+', '', text)

            # Clean up extra whitespace
            text = re.sub(r'\s+', ' ', text)
            text = text.strip()

            return text
        except Exception as e:
            logger.error(f"Error filtering URLs: {str(e)}")
            return text  # Return original text if filtering fails

    async def processFile(self, file_id: str, file_content: bytes) -> Dict[str, List[str]]:
        """
        Process a file based on its extension asynchronously.

        Args:
            file_id: ID of the file to process
            file_content: Content of the file to process
            file_type: Type/extension of the file

        Returns:
            Dict containing extracted topics

        Raises:
            HTTPException: If file processing fails or input validation fails
        """
        # Input validation
        if not file_id or not isinstance(file_id, str):
            raise HTTPException(status_code=400, detail="Invalid file ID")

        if not file_content or not isinstance(file_content, bytes):
            raise HTTPException(
                status_code=400, detail="Invalid file content")

        file_obj = BytesIO(file_content)
        file_obj.name = file_id

        try:
            if not settings.TIKA_SERVER_ENDPOINT:
                raise ValueError("Tika server endpoint not configured")

            parsed_content = parser.from_file(
                file_obj, serverEndpoint=settings.TIKA_SERVER_ENDPOINT)
            if not parsed_content or 'content' not in parsed_content:
                raise HTTPException(
                    status_code=422, detail="Failed to extract text from file")

            extracted_text = parsed_content.get('content', '').strip()
            if not extracted_text:
                raise HTTPException(
                    status_code=422, detail="Extracted text is empty")
        except ValueError as ve:
            logger.error(f"Tika configuration error: {str(ve)}")
            raise HTTPException(
                status_code=500, detail="Text extraction service misconfigured")
        except Exception as e:
            logger.error(f"Tika parsing error: {str(e)}")
            raise HTTPException(
                status_code=500, detail="Error extracting text from file")

        # Filter URLs from extracted text
        cleaned_text = self._filter_urls(extracted_text)
        if not cleaned_text:
            raise HTTPException(
                status_code=422, detail="No valid text content after filtering")

        # Extract topics using OpenAI
        extracted_topics = await self.openai_service.extractTopics(cleaned_text)

        # Upload extracted text content to S3
        text_filename = f"{file_id}.txt"
        upload_success = await self.s3_service.uploadFile(
            key=text_filename,
            content=cleaned_text,
            content_type='text/plain'
        )

        if not upload_success:
            logger.error(
                f"Failed to upload text file to S3: {text_filename}")
            raise HTTPException(
                status_code=500, detail="Failed to store processed text")


        return extracted_topics


# Singleton instance
doc_service = DocumentService()
