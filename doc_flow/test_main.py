import os
import io
import pytest
import json
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi.testclient import TestClient
from fastapi import status

from main import app
from doc_flow.services.doc_service import FileProcessorService
from services.db_service import db_service
from services.s3_service import s3_service
from services.openai_service import openai_service
from services.elevenlabs_service import elevenlabs_service
from core.config import settings

# Create test client
client = TestClient(app)

# Fixtures for mocking services
@pytest.fixture
def mock_s3_service():
    with patch("services.s3_service.s3_service") as mock:
        mock.getFile = AsyncMock()
        mock.uploadFile = AsyncMock(return_value=True)
        yield mock

@pytest.fixture
def mock_db_service():
    with patch("services.db_service.db_service") as mock:
        mock.checkHealth = MagicMock(return_value=True)
        mock.exercise_exists = MagicMock(return_value=True)
        mock.closeConnections = MagicMock()
        yield mock

@pytest.fixture
def mock_openai_service():
    with patch("services.openai_service.openai_service") as mock:
        mock.extractTopics = AsyncMock(return_value=["Topic 1", "Topic 2", "Topic 3"])
        yield mock

@pytest.fixture
def mock_elevenlabs_service():
    with patch("services.elevenlabs_service.elevenlabs_service") as mock:
        mock.generateAudio = AsyncMock()
        yield mock

@pytest.fixture
def mock_file_processor():
    with patch("core.doc_processing.FileProcessor") as mock:
        processor_instance = mock.return_value
        processor_instance.extractTextFromPdf = AsyncMock(return_value="PDF text content")
        processor_instance.extractTextFromPptx = AsyncMock(return_value="PPTX text content")
        processor_instance.extractTextFromXlsx = AsyncMock(return_value="XLSX text content")
        yield processor_instance

# Sample test data
@pytest.fixture
def sample_pdf_bytes():
    # This is a mock PDF file content
    return b"%PDF-1.5\n%Test PDF content"

@pytest.fixture
def sample_pptx_bytes():
    # This is a mock PPTX file content
    return b"PK\x03\x04\x14\x00\x06\x00Test PPTX content"

@pytest.fixture
def sample_xlsx_bytes():
    # This is a mock XLSX file content
    return b"PK\x03\x04\x14\x00\x06\x00Test XLSX content"

# Test cases for root endpoint
def test_get_root():
    """Test the root endpoint returns correct response"""
    response = client.get("/api/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["code"] == 200
    assert data["message"] == "API is running"
    assert "version" in data["data"]

# Test cases for health endpoint
def test_health_check_success(mock_db_service, mock_s3_service):
    """Test health check endpoint when all services are healthy"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["code"] == 200
    assert data["message"] == "All services are healthy"
    assert data["data"]["status"] == "healthy"
    assert data["data"]["services"]["database"] == "healthy"
    assert data["data"]["services"]["s3"] == "healthy"

def test_health_check_db_failure(mock_db_service, mock_s3_service):
    """Test health check endpoint when database is unhealthy"""
    mock_db_service.checkHealth.return_value = False
    response = client.get("/api/health")
    assert response.status_code == 503
    data = response.json()
    assert data["success"] is False
    assert data["code"] == 503
    assert "Database service is unhealthy" in data["message"]
    assert data["data"]["status"] == "unhealthy"
    assert data["data"]["services"]["database"] == "unhealthy"

def test_health_check_s3_failure(mock_db_service, mock_s3_service):
    """Test health check endpoint when S3 is unhealthy"""
    mock_s3_service.client.head_bucket.side_effect = Exception("S3 error")
    response = client.get("/api/health")
    assert response.status_code == 503
    data = response.json()
    assert data["success"] is False
    assert data["code"] == 503
    assert "S3 service is unhealthy" in data["message"]
    assert data["data"]["status"] == "unhealthy"
    assert data["data"]["services"]["s3"] == "unhealthy"

# Test cases for get-exercise-topics endpoint
@pytest.mark.asyncio
async def test_get_exercise_topics_pdf_success(
    mock_s3_service, mock_openai_service, mock_file_processor, sample_pdf_bytes
):
    """Test successful extraction of topics from a PDF file"""
    # Setup mocks
    mock_s3_service.getFile.return_value = sample_pdf_bytes
    
    # Make request
    response = client.post(
        "/api/get-exercise-topics",
        json={"file_id": "test-file-123", "file_type": "pdf"}
    )
    
    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["code"] == 200
    assert data["message"] == "Topics extracted successfully"
    assert data["data"] == ["Topic 1", "Topic 2", "Topic 3"]
    
    # Verify service calls
    mock_s3_service.getFile.assert_called_once()
    mock_openai_service.extractTopics.assert_called_once()
    mock_s3_service.uploadFile.assert_called_once()

@pytest.mark.asyncio
async def test_get_exercise_topics_pptx_success(
    mock_s3_service, mock_openai_service, mock_file_processor, sample_pptx_bytes
):
    """Test successful extraction of topics from a PPTX file"""
    # Setup mocks
    mock_s3_service.getFile.return_value = sample_pptx_bytes
    
    # Make request
    response = client.post(
        "/api/get-exercise-topics",
        json={"file_id": "test-file-123", "file_type": "pptx"}
    )
    
    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["code"] == 200
    assert data["message"] == "Topics extracted successfully"
    assert data["data"] == ["Topic 1", "Topic 2", "Topic 3"]

@pytest.mark.asyncio
async def test_get_exercise_topics_xlsx_success(
    mock_s3_service, mock_openai_service, mock_file_processor, sample_xlsx_bytes
):
    """Test successful extraction of topics from an XLSX file"""
    # Setup mocks
    mock_s3_service.getFile.return_value = sample_xlsx_bytes
    
    # Make request
    response = client.post(
        "/api/get-exercise-topics",
        json={"file_id": "test-file-123", "file_type": "xlsx"}
    )
    
    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["code"] == 200
    assert data["message"] == "Topics extracted successfully"
    assert data["data"] == ["Topic 1", "Topic 2", "Topic 3"]

def test_get_exercise_topics_invalid_file_id():
    """Test get-exercise-topics with invalid file ID format"""
    response = client.post(
        "/api/get-exercise-topics",
        json={"file_id": "test/file/123", "file_type": "pdf"}
    )
    
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "Invalid file ID format" in data["message"]

def test_get_exercise_topics_invalid_file_type():
    """Test get-exercise-topics with invalid file type"""
    response = client.post(
        "/api/get-exercise-topics",
        json={"file_id": "test-file-123", "file_type": "doc"}
    )
    
    assert response.status_code == 500
    data = response.json()
    assert data["success"] is False
    assert "Invalid file type" in data["message"]

@pytest.mark.asyncio
async def test_get_exercise_topics_file_not_found(mock_s3_service):
    """Test get-exercise-topics when file is not found in S3"""
    # Setup mocks
    mock_s3_service.getFile.return_value = None
    
    # Make request
    response = client.post(
        "/api/get-exercise-topics",
        json={"file_id": "nonexistent-file", "file_type": "pdf"}
    )
    
    # Assertions
    assert response.status_code == 500
    data = response.json()
    assert data["success"] is False
    assert "File not found" in data["message"]

# Test cases for generate-audio endpoint
@pytest.mark.asyncio
async def test_generate_audio_success(mock_elevenlabs_service, mock_db_service):
    """Test successful audio generation"""
    # Make request
    response = client.post(
        "/api/generate-audio",
        json={"exercise_id": "exercise-123", "generate_text": "This is a test text for audio generation."}
    )
    
    # Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["code"] == 200
    assert data["message"] == "Audio generated successfully"
    
    # Verify service calls
    mock_elevenlabs_service.generateAudio.assert_called_once_with(
        "exercise-123", "This is a test text for audio generation."
    )

def test_generate_audio_exercise_not_found(mock_db_service):
    """Test generate-audio when exercise is not found"""
    # Setup mocks
    mock_db_service.exercise_exists.return_value = False
    
    # Make request
    response = client.post(
        "/api/generate-audio",
        json={"exercise_id": "nonexistent-exercise", "generate_text": "Test text"}
    )
    
    # Assertions
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["code"] == 404
    assert "Exercise with ID nonexistent-exercise not found" in data["message"]

@pytest.mark.asyncio
async def test_generate_audio_service_failure(mock_elevenlabs_service, mock_db_service):
    """Test generate-audio when ElevenLabs service fails"""
    # Setup mocks
    mock_elevenlabs_service.generateAudio.side_effect = Exception("ElevenLabs API error")
    
    # Make request
    response = client.post(
        "/api/generate-audio",
        json={"exercise_id": "exercise-123", "generate_text": "Test text"}
    )
    
    # Assertions
    assert response.status_code == 500
    data = response.json()
    assert data["success"] is False
    assert "ElevenLabs API error" in data["message"]

# Test cases for validation errors
def test_validation_error_missing_fields():
    """Test validation error when required fields are missing"""
    response = client.post("/api/get-exercise-topics", json={})
    
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["code"] == 422
    assert "field required" in data["message"].lower()

# Test cases for exception handling
def test_general_exception_handling():
    """Test general exception handling"""
    with patch("api.routes.validateFileType", side_effect=Exception("Test exception")):
        response = client.post(
            "/api/get-exercise-topics",
            json={"file_id": "test-file-123", "file_type": "pdf"}
        )
        
        assert response.status_code == 500
        data = response.json()
        assert data["success"] is False
        assert data["code"] == 500
        assert "Test exception" in data["message"]

# Integration tests (these would require actual services in a test environment)
@pytest.mark.integration
@pytest.mark.skipif(not os.environ.get("RUN_INTEGRATION_TESTS"), reason="Integration tests disabled")
def test_integration_full_workflow():
    """Integration test for the full workflow"""
    # This test would use actual services in a test environment
    # Upload a test file to S3
    # Extract topics
    # Generate audio
    # Verify results
    pass

# Performance tests
@pytest.mark.performance
@pytest.mark.skipif(not os.environ.get("RUN_PERFORMANCE_TESTS"), reason="Performance tests disabled")
def test_performance_large_pdf():
    """Performance test for processing a large PDF file"""
    # This test would measure the performance of processing a large PDF file
    pass

# Security tests
@pytest.mark.security
def test_security_cors():
    """Test CORS configuration"""
    # Test that CORS is properly configured
    response = client.options(
        "/api/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type",
        }
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"

# Conftest setup for running tests
if __name__ == "__main__":
    pytest.main(["-v", "test_main.py"])