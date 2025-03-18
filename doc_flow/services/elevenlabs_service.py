import logging
import os
import re
import base64
from elevenlabs.client import ElevenLabs
from elevenlabs.errors import BadRequestError, ForbiddenError, NotFoundError, TooEarlyError, UnprocessableEntityError
from typing import List, Dict
from services.db_service import db_service
from services.s3_service import s3_service
from fastapi import HTTPException
import json


logger = logging.getLogger(__name__)


class ElevenLabsService:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ElevenLabsService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            api_key = os.environ.get("ELEVENLABS_API_KEY")
            if not api_key:
                raise HTTPException(
                    status_code=500, detail="ELEVENLABS_API_KEY is not configured")

            try:
                self.elevenlabs_client = ElevenLabs(api_key=api_key)
                self._initialized = True
            except Exception as e:
                logger.error(
                    f"Failed to initialize ElevenLabs service: {str(e)}")
                raise HTTPException(
                    status_code=500, detail=f"Failed to initialize ElevenLabs service: {str(e)}")

    def filterText(self, text: str) -> str:
        if not text:
            raise HTTPException(
                status_code=400, detail="Input text cannot be empty")

        # Use re.DOTALL to make the dot match newlines as well
        filtered_text = re.findall(r'<listen>(.*?)</listen>', text, re.DOTALL)
        if not filtered_text:
            raise HTTPException(
                status_code=400, detail="No valid <listen> tags found in text")

        # Process each extracted text block
        processed_texts = []
        for text_block in filtered_text:
            # Clean up the text while preserving meaningful content
            cleaned_text = text_block.strip()
            # Replace multiple spaces with a single space
            cleaned_text = re.sub(r' +', ' ', cleaned_text)
            # Replace multiple newlines with a single space
            cleaned_text = re.sub(r'\n+', ' ', cleaned_text)
            processed_texts.append(cleaned_text)
        
        # Join the processed text blocks with periods
        result = '. '.join(processed_texts)
        return result

    def extractTimestamps(self, response: Dict) -> List[Dict]:
        chars = response.normalized_alignment.characters
        starts = response.normalized_alignment.character_start_times_seconds
        ends = response.normalized_alignment.character_end_times_seconds

        timestamps = []
        current_word = ""
        word_start = 0

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

        return timestamps

    async def generateAudio(self, exercise_id: str, text: str) -> Dict:
        print('text', text)
        filtered_text = self.filterText(text)
        print('filtered_text', filtered_text)
        try:
            response = self.elevenlabs_client.text_to_speech.convert_with_timestamps(
                voice_id="JBFqnCBsd6RMkjVDRZzb",
                output_format="mp3_22050_32",
                text=filtered_text,
                model_id="eleven_multilingual_v2",
            )
        except BadRequestError as e:
            raise HTTPException(
                status_code=500,
                detail=f"BadRequestError: {str(e)}"
            )
        except ForbiddenError as e:
            raise HTTPException(
                status_code=500,
                detail=f"ForbiddenError: {str(e)}"
            )
        except TooEarlyError as e:
            raise HTTPException(
                status_code=500,
                detail=f"TooEarlyError: {str(e)}"
            )
        except UnprocessableEntityError as e:
            raise HTTPException(
                status_code=500,
                detail=f"UnprocessableEntityError: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error during API call: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Unexpected error during API call: {str(e)}")

        timestamps = self.extractTimestamps(response)
        db_service.updateExerciseAudioTimestamps(exercise_id, timestamps)

        s3_key = f"{exercise_id}.mp3"
        audio_data = base64.b64decode(response.audio_base_64)

        await s3_service.uploadFile(s3_key, audio_data, "audio/mpeg")


elevenlabs_service = ElevenLabsService()
