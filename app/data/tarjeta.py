from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class Tarjeta(Base):
    __tablename__ = "tarjetas"
    id               = Column(Integer, primary_key=True, index=True)
    nombre           = Column(String(100), nullable=False)
    banco_id         = Column(Integer, ForeignKey("bancos.id"), nullable=False)
    tipo             = Column(String(50), nullable=False)
    cat              = Column(Float, nullable=False)
    anualidad        = Column(Float, nullable=False)
    edad_minima      = Column(Integer, nullable=False)
    beneficios       = Column(Text)
    imagen_url       = Column(String(300))
    aprobada         = Column(Boolean, default=False)
    fecha_creacion   = Column(DateTime, default=datetime.utcnow)
    fecha_aprobacion = Column(DateTime)
    banco            = relationship("Banco", back_populates="tarjetas")
