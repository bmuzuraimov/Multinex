import os
from openai import OpenAI
import openai
from typing import List
import logging
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
logger = logging.getLogger(__name__)

class OpenAIAPIError(Exception):
    """Custom exception for OpenAI API errors"""
    def __init__(self, message, error_code=None, error_type=None):
        self.message = message
        self.error_code = error_code
        self.error_type = error_type
        super().__init__(self.message)

class ContentAnalyzer:
    def __init__(self):
        self.api_key = os.environ.get("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        client.api_key = self.api_key

    async def extract_topics(self, text: str) -> List[str]:
        """
        Extract relevant topics from the text using OpenAI API.
        """
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": f"Extract 5-10 most relevant topics from the following text. Return them as a comma-separated list."
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
                error_code = "unsupported_country_region_territory"
                error_type = "request_forbidden"
                raise OpenAIAPIError(
                    "Service is not available in your region. Please check your VPN settings or contact support.",
                    error_code=error_code,
                    error_type=error_type
                )
            
            error_code = getattr(e, 'code', None)
            error_type = type(e).__name__
            
            raise OpenAIAPIError(
                "Failed to analyze text content. Please try again later.",
                error_code=error_code,
                error_type=error_type
            ) 