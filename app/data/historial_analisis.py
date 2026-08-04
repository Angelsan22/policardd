from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class HistorialAnalisis(Base):
    __tablename__ = "historial_analisis"
    id                    = Column(Integer, primary_key=True, index=True)
    usuario_id            = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    fecha                 = Column(DateTime, default=datetime.utcnow)
    utilizacion_global    = Column(Float, nullable=False)
    nivel_endeudamiento   = Column(String(20), nullable=False)
    riesgo_financiero     = Column(String(20), nullable=False)
    usuario               = relationship("Usuario", backref="historial_analisis")
