import os
from openai import OpenAI
from typing import List
import logging
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()
logger = logging.getLogger(__name__)

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
            return [] 