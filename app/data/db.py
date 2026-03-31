from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# 1. URL de conexion a PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")

# Render envia postgres:// pero SQLAlchemy requiere postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Fallback para local (si no hay variable de entorno)
if not DATABASE_URL:
    DATABASE_URL = "postgresql://admin:123456@postgres:5432/DB_policard"

# 2. Motor de conexion
engine = create_engine(DATABASE_URL)

# 3. Sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base para modelos
Base = declarative_base()

# 5. Funcion para obtener sesion en endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
