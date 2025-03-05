import io
import logging
from typing import List
import asyncio
from PIL import Image
import pytesseract

logger = logging.getLogger(__name__)

def perform_ocr(image: Image.Image) -> str:
    """
    Perform OCR on a PIL image using Tesseract.
    """
    try:
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        logger.error(f"OCR failed: {e}")
        return f"OCR Error: {str(e)}"

async def ocr_images_concurrently(images: List[bytes]) -> List[str]:
    """
    Run OCR on a list of images concurrently using asyncio.
    """
    tasks = [asyncio.to_thread(perform_ocr, Image.open(io.BytesIO(img))) for img in images]
    results = await asyncio.gather(*tasks)
    return results 