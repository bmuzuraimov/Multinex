import logging
import os
import re
import base64
from elevenlabs.client import ElevenLabs
import boto3
from typing import List, Dict
from fastapi import HTTPException
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

class AudioHandler:
    def __init__(self):
        self.elevenlabs_client = ElevenLabs(api_key=os.environ.get("ELEVENLABS_API_KEY"))
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.environ.get('AWS_S3_IAM_ACCESS_KEY'),
            aws_secret_access_key=os.environ.get('AWS_S3_IAM_SECRET_KEY'),
            region_name=os.environ.get('AWS_S3_REGION')
        )
        self.bucket_name = os.environ.get('AWS_S3_FILES_BUCKET')

    def _filter_text(self, text: str) -> str:
        filtered_text = re.findall(r'<listen>(.*?)</listen>', text)
        filtered_text = [re.sub(r'[^a-zA-Z0-9\s]', '', text).strip()
                        for text in filtered_text]
        filtered_text = '.\n'.join(filtered_text)
        filtered_text = re.sub(r'\n{2,}', '', filtered_text.strip())
        return re.sub(r' +', ' ', filtered_text)

    def _extract_timestamps(self, response: Dict) -> List[Dict]:
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

        return timestamps

    async def generate_audio(self, exerciseId: str, generate_text: str) -> Dict:
        try:
            if not generate_text or not exerciseId:
                return JSONResponse(
                    status_code=400,
                    content={
                        "success": False,
                        "message": "Missing required fields: generate_text and exerciseId are required"
                    }
                )
            
            # Validate ElevenLabs API key
            if not os.environ.get("ELEVENLABS_API_KEY"):
                return JSONResponse(
                    status_code=500,
                    content={
                        "success": False,
                        "message": "ELEVENLABS_API_KEY is not configured"
                    }
                )

            # Log incoming request
            logger.info(f"Processing audio generation for exercise {exerciseId}")
            logger.debug(f"Text to process: {generate_text}")
            
            filtered_text = re.findall(r'<listen>(.*?)</listen>', generate_text)
            if not filtered_text:
                return JSONResponse(
                    status_code=200,
                    content={
                        "success": True,
                        "message": "No audio content to generate"
                    }
                )
                
            filtered_text = [re.sub(r'(?<![a-zA-Z0-9])[^a-zA-Z0-9\s]|[^a-zA-Z0-9\s](?![a-zA-Z0-9])', '', text).strip()
                             for text in filtered_text]
            filtered_text = '.\n'.join(filtered_text)
            filtered_text = re.sub(r'\n{2,}', '', filtered_text.strip())
            filtered_text = re.sub(r' +', ' ', filtered_text)

            logger.info(f"Processed text for audio: {filtered_text}")

            try:
                # Generate audio with timestamps
                response = self.elevenlabs_client.text_to_speech.convert_with_timestamps(
                    voice_id="XrExE9yKIg1WjnnlVkGX",  # Matilda
                    output_format="mp3_22050_32",
                    text=filtered_text,
                    model_id="eleven_multilingual_v2",
                )
            except Exception as e:
                logger.error(f"ElevenLabs API error: {str(e)}")
                return JSONResponse(
                    status_code=500,
                    content={
                        "success": False,
                        "message": f"Failed to generate audio: {str(e)}"
                    }
                )

            # Validate response structure
            if not isinstance(response, dict) or "normalized_alignment" not in response:
                logger.error(f"Unexpected response format from ElevenLabs: {response}")
                return JSONResponse(
                    status_code=500,
                    content={
                        "success": False,
                        "message": "Invalid response from audio service"
                    }
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
                            "end": ends[i-1]
                        })
                        current_word = ""
                        word_start = 0
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

            return {
                "success": True,
                "timestamps": timestamps,
                "audio": response["audio"]
            }

        except Exception as e:
            logger.exception("Error generating audio")
            raise HTTPException(status_code=500, detail=str(e))

    async def generate_and_upload_audio(self, exercise_id: str, text: str) -> Dict:
        filtered_text = self._filter_text(text)
        
        # Generate audio with timestamps
        response = self.elevenlabs_client.text_to_speech.convert_with_timestamps(
            voice_id="JBFqnCBsd6RMkjVDRZzb",
            output_format="mp3_22050_32",
            text=filtered_text,
            model_id="eleven_multilingual_v2",
        )

        timestamps = self._extract_timestamps(response)
        
        # Upload to S3
        s3_key = f"{exercise_id}.mp3"
        audio_data = base64.b64decode(response["audio_base64"])
        
        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=s3_key,
            Body=audio_data
        )

        return {
            "timestamps": timestamps,
            "s3_key": s3_key,
            "audio_url": f"https://{self.bucket_name}.s3.amazonaws.com/{s3_key}"
        } 