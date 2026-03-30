from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.data.db import Base

class UsuarioCliente(Base):
    __tablename__ = "usuarios_clientes"
    id               = Column(Integer, primary_key=True, index=True)
    usuario_id       = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    telefono         = Column(String(20))
    fecha_nacimiento = Column(Date)
    direccion        = Column(String(200))
    usuario          = relationship("Usuario", back_populates="cliente", uselist=False)
