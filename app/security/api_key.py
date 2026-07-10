from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

from app.security.config import API_KEY

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def verify_api_key(key: str | None = Depends(_api_key_header)) -> None:
    if key is None or key != API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="API key invalida o ausente")
