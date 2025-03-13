from fastapi import APIRouter
from services.db_service import db_service
from services.s3_service import s3_service
from core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/health")
async def checkHealth():
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
    if not db_service.checkHealth():
        health_status["status"] = "unhealthy"
        health_status["services"]["database"] = "unhealthy"
        return {
            "success": False,
            "code": 503,
            "message": "Database service is unhealthy",
            "data": health_status
        }

    # Check S3 health
    try:
        s3_service.client.head_bucket(Bucket=settings.AWS_S3_EXERCISES_BUCKET)
    except Exception as e:
        logger.error(f"S3 health check failed: {str(e)}")
        health_status["status"] = "unhealthy"
        health_status["services"]["s3"] = "unhealthy"
        return {
            "success": False,
            "code": 503,
            "message": "S3 service is unhealthy",
            "data": health_status
        }

    return {
        "success": True,
        "code": 200,
        "message": "All services are healthy",
        "data": health_status
    }