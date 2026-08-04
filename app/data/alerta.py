from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class Alerta(Base):
    __tablename__ = "alertas"
    id               = Column(Integer, primary_key=True, index=True)
    usuario_id       = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    titulo           = Column(String(150), nullable=False)
    mensaje          = Column(String(300))
    fecha            = Column(String(20), nullable=False)
    tipo             = Column(String(20), nullable=False, default="pago")
    activa           = Column(Boolean, default=True)
    fecha_creacion   = Column(DateTime, default=datetime.utcnow)
    usuario          = relationship("Usuario", backref="alertas")
