import os
import warnings

_DEV_JWT_SECRET     = "policard-dev-jwt-secret-CHANGE-ME"
_DEV_API_KEY        = "policard-dev-api-key-CHANGE-ME"
_DEV_SESSION_SECRET = "policard2025secret"

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", _DEV_JWT_SECRET)
API_KEY        = os.getenv("API_KEY", _DEV_API_KEY)
SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY", _DEV_SESSION_SECRET)

JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60

if JWT_SECRET_KEY == _DEV_JWT_SECRET:
    warnings.warn("JWT_SECRET_KEY no esta configurada por variable de entorno; usando valor de desarrollo inseguro.")
if API_KEY == _DEV_API_KEY:
    warnings.warn("API_KEY no esta configurada por variable de entorno; usando valor de desarrollo inseguro.")
if SESSION_SECRET_KEY == _DEV_SESSION_SECRET:
    warnings.warn("SESSION_SECRET_KEY no esta configurada por variable de entorno; usando valor de desarrollo inseguro.")
