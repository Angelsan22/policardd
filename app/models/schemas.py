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
