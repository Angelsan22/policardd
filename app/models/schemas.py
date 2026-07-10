from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class LoginSchema(BaseModel):
    email: str = Field(..., description="Correo del usuario")
    password: str = Field(..., description="Contrasena")

class RegistroBancoSchema(BaseModel):
    email:           str = Field(..., min_length=5, max_length=120)
    password:        str = Field(..., min_length=6)
    nombre_contacto: str = Field(..., min_length=3, max_length=100)
    nombre_banco:    str = Field(..., min_length=3, max_length=100)
    telefono:        str = Field(..., min_length=7, max_length=20)
    sitio_web:       Optional[str] = None
    descripcion:     Optional[str] = None

class TarjetaSchema(BaseModel):
    nombre:      str   = Field(..., min_length=3, max_length=100)
    tipo:        str   = Field(..., description="estudiante, joven o clasica")
    cat:         float = Field(..., ge=0)
    anualidad:   float = Field(..., ge=0)
    edad_minima: int   = Field(..., ge=18, le=100)
    beneficios:  Optional[str] = None
    imagen_url:  Optional[str] = None


# ── Schemas para la API JSON /api/v1 (app movil) ──────────────────────────

class LoginRequest(BaseModel):
    email:    str = Field(..., description="Correo del usuario")
    password: str = Field(..., description="Contrasena")


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    tipo:         str
    nombre:       str


class TarjetaOut(BaseModel):
    id:          int
    nombre:      str
    banco:       str
    tipo:        str
    cat:         float
    anualidad:   float
    edad_minima: int
    beneficios:  Optional[str] = None
    imagen_url:  Optional[str] = None

    class Config:
        from_attributes = True


class ClienteMeOut(BaseModel):
    id:     int
    nombre: str
    email:  str
    tipo:   str


class SolicitudTarjetaOut(BaseModel):
    id:              int
    tarjeta_id:      int
    tarjeta_nombre:  str
    estado:          str


class SolicitudClienteOut(BaseModel):
    id:              int
    usuario_id:      int
    usuario_nombre:  str
    tarjeta_id:      int
    tarjeta_nombre:  str
    estado:          str
