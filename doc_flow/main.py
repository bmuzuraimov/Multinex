import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from api.routes import router
from api.health import router as health_router
from core.config import settings
from services.db_service import db_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)

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


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=getattr(exc, 'http_status', 500),
        content={
            "success": False,
            "code": getattr(exc, 'http_status', 500),
            "message": getattr(exc, 'message', str(exc))
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logging.error(f"Validation error: {str(exc)}")
    error_details = []
    for error in exc.errors():
        field = error['loc'][-1] if len(error['loc']) > 1 else error['loc'][0]
        error_details.append(f"{field}: {error['msg']}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "code": 422,
            "message": ", ".join(error_details)
        }
    )

# Include routers
app.include_router(router, prefix="/api")
app.include_router(health_router, prefix="/api")


@app.on_event("shutdown")
async def handleShutdown():
    """Cleanup on application shutdown"""
    db_service.closeConnections()
    logging.info("Application shutdown complete")
