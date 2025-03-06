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
    def __init__(self, message, error_code=None, error_type=None, http_status=500):
        self.message = message
        self.error_code = error_code
        self.error_type = error_type
        self.http_status = http_status
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
                if getattr(e, 'code', None) == 'unsupported_country_region_territory':
                    raise OpenAIAPIError(
                        "Service is not available in your region. Please use a supported region or contact support for assistance.",
                        error_code='unsupported_country_region_territory',
                        error_type='permission_denied',
                        http_status=403
                    )
                raise OpenAIAPIError(
                    "Access denied. Please check your API key and permissions.",
                    error_code=getattr(e, 'code', None),
                    error_type='permission_denied',
                    http_status=403
                )
            elif isinstance(e, openai.RateLimitError):
                raise OpenAIAPIError(
                    "Rate limit exceeded. Please try again later.",
                    error_code='rate_limit_exceeded',
                    error_type='rate_limit',
                    http_status=429
                )
            elif isinstance(e, openai.APIConnectionError):
                raise OpenAIAPIError(
                    "Unable to connect to OpenAI services. Please check your internet connection.",
                    error_code='api_connection_error',
                    error_type='connection_error',
                    http_status=503
                )
            elif isinstance(e, openai.InvalidRequestError):
                raise OpenAIAPIError(
                    "Invalid request parameters. Please check your input.",
                    error_code=getattr(e, 'code', None),
                    error_type='invalid_request',
                    http_status=400
                )
            
            # Generic error handler
            raise OpenAIAPIError(
                "An unexpected error occurred while processing your request. Please try again later.",
                error_code=getattr(e, 'code', None),
                error_type=type(e).__name__,
                http_status=500
            ) 