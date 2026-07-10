from datetime import datetime, timedelta

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.data.db import get_db
from app.data.usuario import Usuario
from app.security.config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRE_MINUTES

_bearer_scheme = HTTPBearer(auto_error=False)


def create_access_token(usuario: Usuario) -> str:
    now = datetime.utcnow()
    payload = {
        "sub": str(usuario.id),
        "tipo": usuario.tipo,
        "iat": now,
        "exp": now + timedelta(minutes=JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalido")


def get_current_user_jwt(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falta token de autenticacion")
    payload = decode_access_token(credentials.credentials)
    usuario = db.query(Usuario).filter(Usuario.id == int(payload["sub"])).first()
    if usuario is None or not usuario.activo:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no valido")
    return usuario


def require_role_jwt(*roles: str):
    def dependency(usuario: Usuario = Depends(get_current_user_jwt)) -> Usuario:
        if usuario.tipo not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos para este recurso")
        return usuario
    return dependency
