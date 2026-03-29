from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class SolicitudTarjeta(Base):
    __tablename__ = "solicitudes_tarjetas"
    id              = Column(Integer, primary_key=True, index=True)
    usuario_id      = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tarjeta_id      = Column(Integer, ForeignKey("tarjetas.id"), nullable=False)
    estado          = Column(String(20), default="pendiente")
    fecha_solicitud = Column(DateTime, default=datetime.utcnow)
    usuario         = relationship("Usuario", backref="solicitudes_tarjeta")
    tarjeta         = relationship("Tarjeta", backref="solicitudes_clientes")
