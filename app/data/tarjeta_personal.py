from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class TarjetaPersonal(Base):
    __tablename__ = "tarjetas_personales"
    id               = Column(Integer, primary_key=True, index=True)
    usuario_id       = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    alias            = Column(String(100), nullable=False)
    banco            = Column(String(100), nullable=False)
    limite           = Column(Float, nullable=False)
    saldo_utilizado  = Column(Float, default=0)
    fecha_corte      = Column(String(20))
    fecha_pago       = Column(String(20))
    fecha_creacion   = Column(DateTime, default=datetime.utcnow)
    usuario          = relationship("Usuario", backref="tarjetas_personales")
