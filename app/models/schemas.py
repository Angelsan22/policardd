import re

from pydantic import BaseModel, Field, EmailStr, field_validator, model_validator
from typing import Optional

TIPOS_ALERTA = {"pago", "corte", "riesgo"}

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


class RegistroRequest(BaseModel):
    nombre:           str = Field(..., min_length=3, max_length=100)
    email:            str = Field(..., min_length=5, max_length=120)
    password:         str = Field(..., min_length=6)
    telefono:         str = Field(..., min_length=7, max_length=20)
    fecha_nacimiento: str = Field(..., description="Formato YYYY-MM-DD")
    direccion:        str = Field(..., min_length=3, max_length=200)


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
    id:       int
    nombre:   str
    email:    str
    tipo:     str
    foto_url: Optional[str] = None


class ClienteUpdateRequest(BaseModel):
    nombre:            Optional[str] = Field(None, min_length=3, max_length=100)
    password_actual:   Optional[str] = None
    password_nueva:    Optional[str] = Field(None, min_length=6)


class TarjetaPersonalIn(BaseModel):
    alias:           str   = Field(..., min_length=1, max_length=100)
    banco:           str   = Field(..., min_length=1, max_length=100)
    limite:          float = Field(..., gt=0)
    saldo_utilizado: float = Field(0, ge=0)
    fecha_corte:     Optional[str] = Field(None, max_length=20)
    fecha_pago:      Optional[str] = Field(None, max_length=20)

    @model_validator(mode="after")
    def validar_saldo_no_excede_limite(self):
        if self.saldo_utilizado > self.limite:
            raise ValueError("El saldo utilizado no puede superar el limite de credito")
        return self


class TarjetaPersonalOut(BaseModel):
    id:              int
    alias:           str
    banco:           str
    limite:          float
    saldo_utilizado: float
    fecha_corte:     Optional[str] = None
    fecha_pago:      Optional[str] = None

    class Config:
        from_attributes = True


class AlertaIn(BaseModel):
    titulo:  str = Field(..., min_length=1, max_length=150)
    mensaje: Optional[str] = Field(None, max_length=300)
    fecha:   str = Field(..., min_length=1, max_length=20)
    tipo:    str = Field("pago", description="pago, corte o riesgo")

    @field_validator("fecha")
    @classmethod
    def validar_formato_fecha(cls, valor):
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", valor):
            raise ValueError("fecha debe tener formato YYYY-MM-DD")
        return valor

    @field_validator("tipo")
    @classmethod
    def validar_tipo_alerta(cls, valor):
        if valor not in TIPOS_ALERTA:
            raise ValueError("tipo debe ser pago, corte o riesgo")
        return valor


class AlertaToggle(BaseModel):
    activa: bool


class AlertaOut(BaseModel):
    id:      int
    titulo:  str
    mensaje: Optional[str] = None
    fecha:   str
    tipo:    str
    activa:  bool

    class Config:
        from_attributes = True


class HistorialIn(BaseModel):
    utilizacion_global:  float = Field(..., ge=0)
    nivel_endeudamiento: str
    riesgo_financiero:   str


class HistorialOut(BaseModel):
    id:                   int
    fecha:                str
    utilizacion_global:   float
    nivel_endeudamiento:  str
    riesgo_financiero:    str


class SolicitudTarjetaOut(BaseModel):
    id:              int
    tarjeta_id:      int
    tarjeta_nombre:  str
    tarjeta_banco:   str
    fecha_solicitud: str
    estado:          str


class SolicitudClienteOut(BaseModel):
    id:              int
    usuario_id:      int
    usuario_nombre:  str
    tarjeta_id:      int
    tarjeta_nombre:  str
    estado:          str
