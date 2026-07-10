from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.data.db import engine, Base
from app.routers import publicas, auth, admin, banco, cliente, api
from app.security.config import SESSION_SECRET_KEY
from app.security.rate_limit import limiter

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

# Rate limiting (slowapi)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Middleware de sesion
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY)

# Archivos estaticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Registrar routers
app.include_router(publicas.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(banco.router)
app.include_router(cliente.router)
app.include_router(api.router)

# Inicializar datos base
from app.data.init_db import init_db
init_db()
