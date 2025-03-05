import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Settings
    ALLOWED_ORIGINS: str = os.environ.get(
        "ALLOWED_ORIGINS", 
        "http://localhost:3000,https://typeit.up.railway.app,http://localhost:3001"
    )
    ALLOWED_ORIGINS_LIST: List[str] = [origin.strip() for origin in ALLOWED_ORIGINS.split(",")]

    # AWS Settings
    AWS_S3_IAM_ACCESS_KEY: str = os.environ.get('AWS_S3_IAM_ACCESS_KEY')
    AWS_S3_IAM_SECRET_KEY: str = os.environ.get('AWS_S3_IAM_SECRET_KEY')
    AWS_S3_REGION: str = os.environ.get('AWS_S3_REGION')
    AWS_S3_EXERCISES_BUCKET: str = os.environ.get('AWS_S3_EXERCISES_BUCKET')
    AWS_S3_FILES_BUCKET: str = os.environ.get('AWS_S3_FILES_BUCKET')

    # Database Settings
    DATABASE_URL: str = os.environ.get("DATABASE_URL")

    # API Keys
    ELEVENLABS_API_KEY: str = os.environ.get("ELEVENLABS_API_KEY")

settings = Settings() 