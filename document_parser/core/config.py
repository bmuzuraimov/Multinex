from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Document Parser API"
    
    ALLOWED_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.environ.get(
            "ALLOWED_ORIGINS", 
            "http://localhost:3000,https://typeit.up.railway.app"
        ).split(",")
    ]
    
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "")
    AWS_S3_IAM_ACCESS_KEY: str = os.environ.get("AWS_S3_IAM_ACCESS_KEY", "")
    AWS_S3_IAM_SECRET_KEY: str = os.environ.get("AWS_S3_IAM_SECRET_KEY", "")
    AWS_S3_REGION: str = os.environ.get("AWS_S3_REGION", "")
    ELEVENLABS_API_KEY: str = os.environ.get("ELEVENLABS_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings() 