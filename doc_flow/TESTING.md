# Testing Guide for Document Flow API

This document provides comprehensive guidance on testing the Document Flow API service.

## Table of Contents

1. [Test Structure](#test-structure)
2. [Test Categories](#test-categories)
3. [Running Tests](#running-tests)
4. [Writing New Tests](#writing-new-tests)
5. [Mocking External Services](#mocking-external-services)
6. [Continuous Integration](#continuous-integration)

## Test Structure

The test suite is organized as follows:

- `test_main.py`: Contains all test cases for the FastAPI application
- `pytest.ini`: Configuration file for pytest
- `.env.test`: Environment variables for testing
- `run_tests.sh`: Script to run tests with different configurations

## Test Categories

The test suite is divided into several categories:

### Unit Tests

These tests verify individual components in isolation by mocking external dependencies. They cover:

- API endpoints
- Request validation
- Error handling
- Service functions

### Integration Tests

These tests verify that different components work together correctly. They require:

- Test database
- Mock S3 bucket
- Mock OpenAI service

### Performance Tests

These tests measure the performance of the application under various conditions:

- Processing large files
- Concurrent requests
- Response time

### Security Tests

These tests verify the security aspects of the application:

- CORS configuration
- Input validation
- Authentication (if implemented)

## Running Tests

### Prerequisites

1. Install test dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up test environment:
   ```bash
   cp .env.test .env.test.local  # Create a local copy for customization
   ```

### Using the Test Script

The `run_tests.sh` script provides a convenient way to run tests with different configurations:

```bash
# Run unit tests only
./run_tests.sh -u

# Run all tests (unit, integration, performance)
./run_tests.sh -a

# Run unit tests with coverage report
./run_tests.sh -u -c

# Show help
./run_tests.sh -h
```

### Manual Test Execution

You can also run tests manually using pytest:

```bash
# Run all tests
python -m pytest

# Run specific test file
python -m pytest test_main.py

# Run specific test
python -m pytest test_main.py::test_health_check_success

# Run with coverage
python -m pytest --cov=. --cov-report=term --cov-report=html
```

## Writing New Tests

When writing new tests, follow these guidelines:

1. **Use fixtures**: Create fixtures for common setup and teardown operations
2. **Mock external services**: Use the provided mock fixtures for external services
3. **Use descriptive names**: Test names should describe what they're testing
4. **Add docstrings**: Each test should have a docstring explaining what it tests
5. **Use markers**: Add appropriate markers for test categorization

Example:

```python
@pytest.mark.asyncio
async def test_new_feature():
    """Test description here"""
    # Test implementation
```

## Mocking External Services

The test suite provides fixtures for mocking external services:

- `mock_s3_service`: Mocks the S3 service
- `mock_db_service`: Mocks the database service
- `mock_openai_service`: Mocks the OpenAI service
- `mock_elevenlabs_service`: Mocks the ElevenLabs service
- `mock_file_processor`: Mocks the file processor

Example usage:

```python
def test_with_mocks(mock_s3_service, mock_openai_service):
    # Test implementation using mocks
    mock_s3_service.getFile.return_value = b"test content"
    # ...
```

## Continuous Integration

The test suite is designed to be run in a CI/CD pipeline. Here's a sample configuration for GitHub Actions:

```yaml
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Run tests
      run: |
        ./run_tests.sh -u -c
    - name: Upload coverage report
      uses: actions/upload-artifact@v3
      with:
        name: coverage-report
        path: htmlcov/
```

---

For any questions or issues with the test suite, please contact the development team. 