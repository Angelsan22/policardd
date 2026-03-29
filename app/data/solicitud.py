from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class Solicitud(Base):
    __tablename__ = "solicitudes"
    id               = Column(Integer, primary_key=True, index=True)
    banco_id         = Column(Integer, ForeignKey("bancos.id"), nullable=False)
    tipo_solicitud   = Column(String(50), nullable=False)
    referencia_id    = Column(Integer)
    estado           = Column(String(20), default="pendiente")
    comentario_admin = Column(Text)
    fecha_solicitud  = Column(DateTime, default=datetime.utcnow)
    fecha_respuesta  = Column(DateTime)
    banco_rel        = relationship("Banco", back_populates="solicitudes")
