from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from typing import Dict, Tuple
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = defaultdict(list)

    def is_rate_limited(self, client_ip: str) -> Tuple[bool, int]:
        """
        Check if the client is rate limited
        
        Returns:
            Tuple[bool, int]: (is_limited, remaining_requests)
        """
        now = datetime.now()
        minute_ago = now - timedelta(minutes=1)
        
        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if req_time > minute_ago
        ]
        
        # Check if rate limited
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            return True, 0
            
        # Add current request
        self.requests[client_ip].append(now)
        remaining = self.requests_per_minute - len(self.requests[client_ip])
        
        return False, remaining

    async def __call__(self, request: Request, call_next):
        client_ip = request.client.host
        
        is_limited, remaining = self.is_rate_limited(client_ip)
        
        if is_limited:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too many requests",
                    "message": "Please try again later",
                    "retry_after": 60
                },
                headers={"Retry-After": "60"}
            )
            
        response = await call_next(request)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        
        return response 