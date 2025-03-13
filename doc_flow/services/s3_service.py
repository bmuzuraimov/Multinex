import logging
import boto3
from typing import Optional
from core.config import settings
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class S3Service:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(S3Service, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_S3_IAM_ACCESS_KEY,
                aws_secret_access_key=settings.AWS_S3_IAM_SECRET_KEY,
                region_name=settings.AWS_S3_REGION
            )
            self.bucket = settings.AWS_S3_EXERCISES_BUCKET
            self._initialized = True

    async def uploadFile(self, key: str, content: bytes, content_type: Optional[str] = None) -> bool:
        """Upload a file to S3"""
        try:
            extra_args = {'ContentType': content_type} if content_type else {}
            response = self.s3_client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=content,
                **extra_args
            )
            if response['ResponseMetadata']['HTTPStatusCode'] != 200:
                raise Exception(f"S3 upload failed with status code: {response['ResponseMetadata']['HTTPStatusCode']}")
            return True
        except Exception as e:
            logger.error(f"Failed to upload file to S3: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload file to S3: {str(e)}"
            )

    async def getFile(self, key: str) -> Optional[bytes]:
        """Retrieve a file from S3"""
        try:
            response = self.s3_client.get_object(Bucket=self.bucket, Key=key)
            return response['Body'].read()
        except Exception as e:
            logger.error(f"Failed to get file from S3: {str(e)}")
            return None

    async def deleteFile(self, key: str) -> bool:
        """Delete a file from S3"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket, Key=key)
            return True
        except Exception as e:
            logger.error(f"Failed to delete file from S3: {str(e)}")
            return False

    def getFileUrl(self, key: str) -> str:
        """Generate a URL for a file in S3"""
        return f"https://{self.bucket}.s3.amazonaws.com/{key}"

s3_service = S3Service()