import os
from openai import OpenAI
import openai
from typing import List
import logging
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()
logger = logging.getLogger(__name__)

class OpenAIService:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(OpenAIService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.api_key = os.environ.get("OPENAI_API_KEY")
            if not self.api_key:
                raise ValueError("OPENAI_API_KEY environment variable is not set")
            self.client = OpenAI(api_key=self.api_key)
            self._initialized = True

    async def extractTopics(self, text: str) -> List[str]:
        """
        Extract relevant topics from the text using OpenAI API.
        """
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": f"Extract main distinct and non-overlapping topics from the following text. Return them as a comma-separated list with descriptive names with relation to the main topic of the text."
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.5,
                max_tokens=16383
            )
            
            topics = response.choices[0].message.content.split(",")
            return [topic.strip() for topic in topics]
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            
            if isinstance(e, openai.PermissionDeniedError):
                if getattr(e, 'code', None) == 'unsupported_country_region_territory':
                    raise HTTPException(
                        status_code=403,
                        detail="Service is not available in your region. Please use a supported region or contact support for assistance."
                    )
                raise HTTPException(
                    status_code=403,
                    detail="Access denied. Please check your API key and permissions."
                )
            elif isinstance(e, openai.RateLimitError):
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded. Please try again later."
                )
            elif isinstance(e, openai.APIConnectionError):
                raise HTTPException(
                    status_code=503,
                    detail="Unable to connect to OpenAI services. Please check your internet connection."
                )
            elif isinstance(e, openai.InvalidRequestError):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid request parameters. Please check your input."
                )
            
            # Generic error handler
            raise HTTPException(
                status_code=500,
                detail="An unexpected error occurred while processing your request. Please try again later."
            )

openai_service = OpenAIService()