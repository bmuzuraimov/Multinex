from fastapi import APIRouter, HTTPException
from services.database_service import DatabaseService
from services.s3_service import S3Service
from core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

db_service = DatabaseService()
s3_service = S3Service()

@router.get("/health")
async def health_check():
    """
    Check the health of all service dependencies
    """
    health_status = {
        "status": "healthy",
        "services": {
            "database": "healthy",
            "s3": "healthy"
        }
    }

    # Check database health
    if not db_service.health_check():
        health_status["status"] = "unhealthy"
        health_status["services"]["database"] = "unhealthy"
        raise HTTPException(status_code=503, detail="Database service is unhealthy")

    # Check S3 health
    try:
        s3_service.client.head_bucket(Bucket=settings.AWS_S3_EXERCISES_BUCKET)
    except Exception as e:
        logger.error(f"S3 health check failed: {str(e)}")
        health_status["status"] = "unhealthy"
        health_status["services"]["s3"] = "unhealthy"
        raise HTTPException(status_code=503, detail="S3 service is unhealthy")

    return health_status 