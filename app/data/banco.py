from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class Banco(Base):
    __tablename__ = "bancos"
    id               = Column(Integer, primary_key=True, index=True)
    usuario_id       = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nombre_banco     = Column(String(100), nullable=False)
    telefono         = Column(String(20))
    sitio_web        = Column(String(200))
    descripcion      = Column(Text)
    logo_url         = Column(String(300))
    aprobado         = Column(Boolean, default=False)
    fecha_aprobacion = Column(DateTime)
    usuario          = relationship("Usuario", back_populates="banco")
    tarjetas         = relationship("Tarjeta", back_populates="banco", cascade="all, delete-orphan")
    solicitudes      = relationship("Solicitud", back_populates="banco_rel")
