import io
import logging
from typing import List
import asyncio
from PIL import Image
import pytesseract

logger = logging.getLogger(__name__)

class OcrService:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(OcrService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self._initialized = True

    def performOcr(self, image: Image.Image) -> str:
        """
        Perform OCR on a PIL image using Tesseract.
        """
        try:
            ocr_text = pytesseract.image_to_string(image)
            return ocr_text.strip()
        except Exception as e:
            logger.error(f"OCR failed: {e}")
            raise Exception(
                "OCR processing failed. Please try again with a different image.",
                error_code='ocr_processing_failed',
                error_type='processing_error', 
                http_status=500
            )

    async def processImagesWithOcr(self, images: List[bytes]) -> List[str]:
        """
        Run OCR on a list of images concurrently using asyncio.
        """
        try:
            ocr_tasks = [asyncio.to_thread(self.performOcr, Image.open(io.BytesIO(img))) for img in images]
            ocr_results = await asyncio.gather(*ocr_tasks)
            return ocr_results
        except Exception as e:
            logger.error(f"Failed to process images with OCR: {e}")
            raise Exception(
                "Failed to process images. Please check the image format and try again.",
                error_code='image_processing_failed',
                error_type='processing_error',
                http_status=500
            )

ocr_service = OcrService()