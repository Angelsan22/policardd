from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.data.db import Base
from datetime import datetime

class AdminLog(Base):
    __tablename__ = "admin_logs"

    id              = Column(Integer, primary_key=True, index=True)
    creado_por_id   = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    usuario_nuevo_id= Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    accion          = Column(String(50), default="crear_admin")   # crear_admin | desactivar | reactivar
    notas           = Column(Text, nullable=True)
    fecha           = Column(DateTime, default=datetime.utcnow)

    creado_por      = relationship("Usuario", foreign_keys=[creado_por_id])
    usuario_nuevo   = relationship("Usuario", foreign_keys=[usuario_nuevo_id])
