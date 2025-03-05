import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from api.routes import router
from api.health import router as health_router
from core.config import settings
from core.rate_limit import RateLimiter
from services.database_service import DatabaseService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)

# Initialize services
db_service = DatabaseService()
rate_limiter = RateLimiter(requests_per_minute=60)

app = FastAPI(
    title="File Text Extraction API",
    description="A service to extract text from PDF, PPTX, and XLSX files, including OCR on images.",
    version="1.0.0",
    docs_url=None,
    redoc_url=None
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.middleware("http")(rate_limiter)

# Include routers
app.include_router(router)
app.include_router(health_router, prefix="/api")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions"""
    logging.exception("Unhandled exception occurred")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred"
        }
    )

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    db_service.close()
    logging.info("Application shutdown complete")
