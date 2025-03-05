# Use the official Python slim image as the base
FROM python:3.13.1-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory in container
WORKDIR /app

# Install system dependencies and Tesseract OCR
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        cmake \
        build-essential \
        gcc \
        g++ \
        git \
        libgomp1 \
        tesseract-ocr \
        libtesseract-dev \
        libleptonica-dev \
        pkg-config \
        poppler-utils \
        && rm -rf /var/lib/apt/lists/*

# (Optional) Install additional language packs for Tesseract
# For example, to install English and Mandarin language packs:
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        tesseract-ocr-eng \
        tesseract-ocr-chi-sim \
        && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache for dependencies
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Ensure Tesseract is in PATH (usually it is, but just in case)
ENV PATH="/usr/bin:${PATH}"

# Expose port 8000
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
