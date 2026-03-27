from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200/minute"],
)


async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Demasiadas solicitudes. Por favor espera antes de intentar nuevamente.",
            "retry_after": str(exc.retry_after) if hasattr(exc, "retry_after") else None,
        },
        headers={"Retry-After": str(getattr(exc, "retry_after", 60))},
    )
