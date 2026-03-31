from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from app.data.db import engine, Base
from app.routers import publicas, auth, admin, banco, cliente

# Importar modelos para que SQLAlchemy los registre
from app.data import usuario, banco as bancoModel, tarjeta, solicitud
from app.data import usuario_cliente, solicitud_tarjeta, admin_log

# Crear tablas
Base.metadata.create_all(bind=engine)

# Instancia de FastAPI
app = FastAPI(
    title="PoliCard",
    description="Plataforma de tarjetas de credito para jovenes",
    version="1.0.0"
)

# Middleware de sesion
app.add_middleware(SessionMiddleware, secret_key="policard2025secret")

# Archivos estaticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Registrar routers
app.include_router(publicas.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(banco.router)
app.include_router(cliente.router)

# Inicializar datos base
from app.data.init_db import init_db
init_db()
