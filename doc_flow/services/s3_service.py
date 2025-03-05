import logging
import boto3
from typing import Optional
from core.config import settings

logger = logging.getLogger(__name__)

class S3Service:
    def __init__(self):
        self.client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_S3_IAM_ACCESS_KEY,
            aws_secret_access_key=settings.AWS_S3_IAM_SECRET_KEY,
            region_name=settings.AWS_S3_REGION
        )
        self.exercises_bucket = settings.AWS_S3_EXERCISES_BUCKET
        self.files_bucket = settings.AWS_S3_FILES_BUCKET

    async def upload_file(self, bucket: str, key: str, content: bytes, content_type: Optional[str] = None) -> bool:
        """Upload a file to S3"""
        try:
            extra_args = {'ContentType': content_type} if content_type else {}
            self.client.put_object(
                Bucket=bucket,
                Key=key,
                Body=content,
                **extra_args
            )
            return True
        except Exception as e:
            logger.error(f"Failed to upload file to S3: {str(e)}")
            return False

    async def get_file(self, bucket: str, key: str) -> Optional[bytes]:
        """Retrieve a file from S3"""
        try:
            response = self.client.get_object(Bucket=bucket, Key=key)
            return response['Body'].read()
        except Exception as e:
            logger.error(f"Failed to get file from S3: {str(e)}")
            return None

    async def delete_file(self, bucket: str, key: str) -> bool:
        """Delete a file from S3"""
        try:
            self.client.delete_object(Bucket=bucket, Key=key)
            return True
        except Exception as e:
            logger.error(f"Failed to delete file from S3: {str(e)}")
            return False

    def get_file_url(self, bucket: str, key: str) -> str:
        """Generate a URL for a file in S3"""
        return f"https://{bucket}.s3.amazonaws.com/{key}" 