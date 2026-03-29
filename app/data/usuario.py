from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class Usuario(Base):
    __tablename__ = "usuarios"
    id             = Column(Integer, primary_key=True, index=True)
    email          = Column(String(120), unique=True, nullable=False)
    password       = Column(String(200), nullable=False)
    nombre         = Column(String(100), nullable=False)
    tipo           = Column(String(20), nullable=False)
    activo         = Column(Boolean, default=True)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    face_encoding  = Column(Text, nullable=True)
    banco          = relationship("Banco", back_populates="usuario", uselist=False, cascade="all, delete-orphan")
