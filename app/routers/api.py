from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from werkzeug.security import check_password_hash

from app.data.db import get_db
from app.data.usuario import Usuario
from app.data.tarjeta import Tarjeta
from app.data.solicitud_tarjeta import SolicitudTarjeta
from app.models.schemas import (
    LoginRequest, TokenResponse, TarjetaOut, ClienteMeOut,
    SolicitudTarjetaOut, SolicitudClienteOut,
)
from app.security.api_key import verify_api_key
from app.security.jwt_auth import create_access_token, require_role_jwt
from app.security.rate_limit import limiter

# Todas las rutas de esta API requieren X-API-Key (identifica a la app oficial).
router = APIRouter(prefix="/api/v1", tags=["API Movil"], dependencies=[Depends(verify_api_key)])


@router.post("/auth/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def api_login(request: Request, data: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == data.email).first()
    if not usuario or not usuario.activo or not check_password_hash(usuario.password, data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invalidas")
    token = create_access_token(usuario)
    return TokenResponse(access_token=token, tipo=usuario.tipo, nombre=usuario.nombre)


@router.get("/tarjetas", response_model=list[TarjetaOut])
@limiter.limit("30/minute")
async def api_tarjetas(request: Request, db: Session = Depends(get_db)):
    tarjetas = db.query(Tarjeta).filter(Tarjeta.aprobada == True).all()
    return [
        TarjetaOut(
            id=t.id, nombre=t.nombre, banco=t.banco.nombre_banco, tipo=t.tipo,
            cat=t.cat, anualidad=t.anualidad, edad_minima=t.edad_minima,
            beneficios=t.beneficios, imagen_url=t.imagen_url,
        )
        for t in tarjetas
    ]


@router.get("/cliente/me", response_model=ClienteMeOut)
async def api_cliente_me(usuario: Usuario = Depends(require_role_jwt("cliente"))):
    # El id del cliente sale del JWT (claim "sub"), nunca de un parametro
    # controlado por el cliente -> no explotable como BOLA/IDOR.
    return ClienteMeOut(id=usuario.id, nombre=usuario.nombre, email=usuario.email, tipo=usuario.tipo)


@router.get("/cliente/solicitudes", response_model=list[SolicitudTarjetaOut])
async def api_cliente_solicitudes(
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    solicitudes = db.query(SolicitudTarjeta).filter(SolicitudTarjeta.usuario_id == usuario.id).all()
    return [
        SolicitudTarjetaOut(
            id=s.id, tarjeta_id=s.tarjeta_id, tarjeta_nombre=s.tarjeta.nombre, estado=s.estado
        )
        for s in solicitudes
    ]


@router.post("/cliente/tarjeta/{id}/solicitar")
@limiter.limit("10/minute")
async def api_solicitar_tarjeta(
    id: int,
    request: Request,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    tarjeta = db.query(Tarjeta).filter(Tarjeta.id == id, Tarjeta.aprobada == True).first()
    if tarjeta is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarjeta no encontrada")

    ya_solicitada = db.query(SolicitudTarjeta).filter(
        SolicitudTarjeta.usuario_id == usuario.id,
        SolicitudTarjeta.tarjeta_id == id,
    ).first()
    if ya_solicitada:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya solicitaste esta tarjeta anteriormente")

    sol = SolicitudTarjeta(usuario_id=usuario.id, tarjeta_id=id)
    db.add(sol)
    db.commit()
    return {"mensaje": "Solicitud enviada", "solicitud_id": sol.id}


@router.get("/banco/solicitudes-clientes", response_model=list[SolicitudClienteOut])
async def api_banco_solicitudes_clientes(
    usuario: Usuario = Depends(require_role_jwt("banco")),
    db: Session = Depends(get_db),
):
    if not usuario.banco:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cuenta sin banco asociado")
    tarjeta_ids = [t.id for t in usuario.banco.tarjetas]
    solicitudes = db.query(SolicitudTarjeta).filter(
        SolicitudTarjeta.tarjeta_id.in_(tarjeta_ids)
    ).all() if tarjeta_ids else []
    return [
        SolicitudClienteOut(
            id=s.id, usuario_id=s.usuario_id, usuario_nombre=s.usuario.nombre,
            tarjeta_id=s.tarjeta_id, tarjeta_nombre=s.tarjeta.nombre, estado=s.estado,
        )
        for s in solicitudes
    ]


@router.post("/banco/solicitud-cliente/{id}/aprobar")
async def api_banco_aprobar_solicitud(
    id: int,
    usuario: Usuario = Depends(require_role_jwt("banco")),
    db: Session = Depends(get_db),
):
    if not usuario.banco:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cuenta sin banco asociado")
    # Mismo control BOLA/IDOR que en banco.py: solo se puede aprobar una
    # solicitud si pertenece a una tarjeta del banco autenticado.
    tarjeta_ids = [t.id for t in usuario.banco.tarjetas]
    sol = db.query(SolicitudTarjeta).filter(
        SolicitudTarjeta.id == id,
        SolicitudTarjeta.tarjeta_id.in_(tarjeta_ids),
    ).first()
    if sol is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud no encontrada")
    sol.estado = "aprobada"
    db.commit()
    return {"mensaje": "Solicitud aprobada"}
