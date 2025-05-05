# Document Flow Processing Service

## Overview
This service is a FastAPI-based application designed to handle document processing, text extraction, and analysis. It supports multiple file formats including PDF, PPTX, and XLSX, with OCR capabilities for images.

## Project Structure

```
doc_flow/
├── api/                    # API route definitions
│   ├── routes.py          # Main API endpoints
│   └── health.py          # Health check endpoints
├── core/                   # Core functionality
├── schemas/               # Pydantic models and schemas
├── services/              # Business logic services
│   ├── audio_handler.py              # Audio processing service
│   ├── database_service.py           # Database operations
│   ├── document_content_extractor.py # Document text extraction
│   ├── document_processing_orchestrator.py # Processing coordination
│   ├── ocr_handler.py               # OCR processing
│   ├── openai_analyzer.py           # OpenAI integration
│   └── s3_service.py                # S3 storage operations
├── main.py               # Application entry point
├── requirements.txt      # Project dependencies
└── Dockerfile           # Container configuration
```

## Key Components

### API Response Format
All API endpoints return responses in a standardized format:

```json
{
  "success": boolean,   // Whether the operation was successful
  "code": number,       // HTTP status code
  "message": string,    // Human-readable message
  "data": any           // Optional response data
}
```

This format ensures consistency across all endpoints and makes it easier for clients to handle responses. The `success` field provides a quick way to check if the request was successful, while the `code` field contains the HTTP status code. The `message` field provides a human-readable description of the result, and the `data` field contains the actual response data when applicable.

### API Layer
- FastAPI-based REST API
- Rate limiting middleware (60 requests per minute)
- CORS and GZip compression support
- Standardized error handling

### Services
1. **Document Processing**
   - Supports PDF, PPTX, and XLSX formats
   - OCR capabilities for image-based content
   - Content extraction and analysis

2. **Storage & Database**
   - S3 integration for document storage
   - PostgreSQL database for metadata and results

3. **AI & Analysis**
   - OpenAI integration for content analysis
   - Audio processing capabilities
   - Document orchestration and workflow management

## Dependencies
Major dependencies include:
- FastAPI (0.115.6)
- OpenAI (1.57.4)
- SQLAlchemy (2.0.37)
- Boto3 (1.36.8)
- Pytesseract (0.3.13)
- Python-PPTX (1.0.2)

## Environment Setup
1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Unix/macOS
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables in `.env` file:
   - Database credentials
   - S3 configuration
   - OpenAI API key
   - Other service-specific settings

## Running the Application
1. Local development:
   ```bash
   uvicorn main:app --reload
   ```

2. Docker:
   ```bash
   docker build -t doc-flow .
   docker run -p 8000:8000 doc-flow
   ```

## API Documentation
- Main API endpoints are available at `/api`
- Health check endpoint at `/api/health`
- Swagger documentation is disabled for security (can be enabled in development)

## Logging
- Application logs are written to `app.log`
- Includes both file and console logging
- Structured logging format with timestamps and log levels

## Security Features
- Rate limiting protection
- CORS configuration
- Input validation using Pydantic
- Standardized error handling
- Secure file processing

## Maintenance
- Regular monitoring of app.log
- Database connection management
- Proper shutdown handling for cleanup
- S3 storage management

## Contributing
1. Follow the existing code structure
2. Implement proper error handling
3. Add appropriate logging
4. Update documentation as needed 