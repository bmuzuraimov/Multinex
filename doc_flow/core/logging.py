import logging
from typing import Any

def setupLogging() -> Any:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )
    return logging.getLogger(__name__)

logger = setupLogging()