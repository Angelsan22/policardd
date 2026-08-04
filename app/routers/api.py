import os
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from sqlalchemy.orm import Session
from werkzeug.security import check_password_hash, generate_password_hash

from app.data.db import get_db
from app.data.usuario import Usuario
from app.data.usuario_cliente import UsuarioCliente
from app.data.tarjeta import Tarjeta
from app.data.tarjeta_personal import TarjetaPersonal
from app.data.alerta import Alerta
from app.data.historial_analisis import HistorialAnalisis
from app.data.solicitud_tarjeta import SolicitudTarjeta
from app.models.schemas import (
    LoginRequest, RegistroRequest, TokenResponse, TarjetaOut, ClienteMeOut,
    ClienteUpdateRequest, TarjetaPersonalIn, TarjetaPersonalOut,
    AlertaIn, AlertaToggle, AlertaOut, HistorialIn, HistorialOut,
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


@router.post("/auth/registro", response_model=TokenResponse)
@limiter.limit("5/minute")
async def api_registro(request: Request, data: RegistroRequest, db: Session = Depends(get_db)):
    if db.query(Usuario).filter(Usuario.email == data.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Este email ya esta registrado")

    try:
        fecha = datetime.strptime(data.fecha_nacimiento, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="fecha_nacimiento invalida, usa YYYY-MM-DD")

    usuario = Usuario(
        email    = data.email,
        password = generate_password_hash(data.password),
        nombre   = data.nombre,
        tipo     = "cliente",
    )
    db.add(usuario)
    db.flush()

    cliente = UsuarioCliente(
        usuario_id       = usuario.id,
        telefono         = data.telefono,
        fecha_nacimiento = fecha,
        direccion        = data.direccion,
    )
    db.add(cliente)
    db.commit()

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
    return ClienteMeOut(id=usuario.id, nombre=usuario.nombre, email=usuario.email, tipo=usuario.tipo, foto_url=usuario.foto_url)


@router.patch("/cliente/me", response_model=ClienteMeOut)
async def api_cliente_actualizar(
    data: ClienteUpdateRequest,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    if data.nombre:
        usuario.nombre = data.nombre

    if data.password_nueva:
        if not data.password_actual or not check_password_hash(usuario.password, data.password_actual):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Contrasena actual incorrecta")
        usuario.password = generate_password_hash(data.password_nueva)

    db.commit()
    db.refresh(usuario)
    return ClienteMeOut(id=usuario.id, nombre=usuario.nombre, email=usuario.email, tipo=usuario.tipo, foto_url=usuario.foto_url)


@router.post("/cliente/me/foto", response_model=ClienteMeOut)
async def api_cliente_subir_foto(
    foto: UploadFile = File(...),
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    extension = os.path.splitext(foto.filename or "")[1].lower() or ".jpg"
    if extension not in (".jpg", ".jpeg", ".png", ".webp"):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Formato de imagen no soportado")

    carpeta = os.path.join("static", "uploads", "perfil")
    os.makedirs(carpeta, exist_ok=True)
    nombre_archivo = f"{usuario.id}-{uuid.uuid4().hex}{extension}"
    ruta_completa = os.path.join(carpeta, nombre_archivo)

    contenido = await foto.read()
    with open(ruta_completa, "wb") as f:
        f.write(contenido)

    usuario.foto_url = f"/static/uploads/perfil/{nombre_archivo}"
    db.commit()
    db.refresh(usuario)
    return ClienteMeOut(id=usuario.id, nombre=usuario.nombre, email=usuario.email, tipo=usuario.tipo, foto_url=usuario.foto_url)


@router.post("/cliente/baja")
async def api_cliente_baja(
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    usuario.activo = False
    db.commit()
    return {"mensaje": "Cuenta dada de baja"}


@router.get("/cliente/solicitudes", response_model=list[SolicitudTarjetaOut])
async def api_cliente_solicitudes(
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    solicitudes = db.query(SolicitudTarjeta).filter(SolicitudTarjeta.usuario_id == usuario.id).all()
    return [
        SolicitudTarjetaOut(
            id=s.id, tarjeta_id=s.tarjeta_id, tarjeta_nombre=s.tarjeta.nombre,
            tarjeta_banco=s.tarjeta.banco.nombre_banco if s.tarjeta.banco else "",
            fecha_solicitud=s.fecha_solicitud.strftime("%Y-%m-%d %H:%M"),
            estado=s.estado,
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


# ── Mis tarjetas (wallet personal del cliente) ─────────────────────────────

@router.get("/cliente/tarjetas-personales", response_model=list[TarjetaPersonalOut])
async def api_listar_tarjetas_personales(
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    return db.query(TarjetaPersonal).filter(TarjetaPersonal.usuario_id == usuario.id).order_by(
        TarjetaPersonal.fecha_creacion.desc()
    ).all()


@router.post("/cliente/tarjetas-personales", response_model=TarjetaPersonalOut)
async def api_crear_tarjeta_personal(
    data: TarjetaPersonalIn,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    tarjeta = TarjetaPersonal(usuario_id=usuario.id, **data.model_dump())
    db.add(tarjeta)
    db.commit()
    db.refresh(tarjeta)
    return tarjeta


@router.put("/cliente/tarjetas-personales/{id}", response_model=TarjetaPersonalOut)
async def api_editar_tarjeta_personal(
    id: int,
    data: TarjetaPersonalIn,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    tarjeta = db.query(TarjetaPersonal).filter(
        TarjetaPersonal.id == id, TarjetaPersonal.usuario_id == usuario.id
    ).first()
    if tarjeta is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarjeta no encontrada")

    for campo, valor in data.model_dump().items():
        setattr(tarjeta, campo, valor)
    db.commit()
    db.refresh(tarjeta)
    return tarjeta


@router.delete("/cliente/tarjetas-personales/{id}")
async def api_eliminar_tarjeta_personal(
    id: int,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    tarjeta = db.query(TarjetaPersonal).filter(
        TarjetaPersonal.id == id, TarjetaPersonal.usuario_id == usuario.id
    ).first()
    if tarjeta is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarjeta no encontrada")

    db.delete(tarjeta)
    db.commit()
    return {"mensaje": "Tarjeta eliminada"}


# ── Alertas del cliente ─────────────────────────────────────────────────

@router.get("/cliente/alertas", response_model=list[AlertaOut])
async def api_listar_alertas(
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    return db.query(Alerta).filter(Alerta.usuario_id == usuario.id).order_by(
        Alerta.fecha_creacion.desc()
    ).all()


@router.post("/cliente/alertas", response_model=AlertaOut)
async def api_crear_alerta(
    data: AlertaIn,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    alerta = Alerta(usuario_id=usuario.id, **data.model_dump())
    db.add(alerta)
    db.commit()
    db.refresh(alerta)
    return alerta


@router.patch("/cliente/alertas/{id}", response_model=AlertaOut)
async def api_alternar_alerta(
    id: int,
    data: AlertaToggle,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    alerta = db.query(Alerta).filter(Alerta.id == id, Alerta.usuario_id == usuario.id).first()
    if alerta is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alerta no encontrada")

    alerta.activa = data.activa
    db.commit()
    db.refresh(alerta)
    return alerta


@router.delete("/cliente/alertas/{id}")
async def api_eliminar_alerta(
    id: int,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    alerta = db.query(Alerta).filter(Alerta.id == id, Alerta.usuario_id == usuario.id).first()
    if alerta is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alerta no encontrada")

    db.delete(alerta)
    db.commit()
    return {"mensaje": "Alerta eliminada"}


# ── Historial de analisis financieros ───────────────────────────────────

@router.get("/cliente/historial", response_model=list[HistorialOut])
async def api_listar_historial(
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    registros = db.query(HistorialAnalisis).filter(HistorialAnalisis.usuario_id == usuario.id).order_by(
        HistorialAnalisis.fecha.desc()
    ).all()
    return [
        HistorialOut(
            id=r.id, fecha=r.fecha.strftime("%Y-%m-%d"), utilizacion_global=r.utilizacion_global,
            nivel_endeudamiento=r.nivel_endeudamiento, riesgo_financiero=r.riesgo_financiero,
        )
        for r in registros
    ]


@router.post("/cliente/historial", response_model=HistorialOut)
async def api_crear_historial(
    data: HistorialIn,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    registro = HistorialAnalisis(usuario_id=usuario.id, **data.model_dump())
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return HistorialOut(
        id=registro.id, fecha=registro.fecha.strftime("%Y-%m-%d"), utilizacion_global=registro.utilizacion_global,
        nivel_endeudamiento=registro.nivel_endeudamiento, riesgo_financiero=registro.riesgo_financiero,
    )


@router.delete("/cliente/historial/{id}")
async def api_eliminar_historial(
    id: int,
    usuario: Usuario = Depends(require_role_jwt("cliente")),
    db: Session = Depends(get_db),
):
    registro = db.query(HistorialAnalisis).filter(
        HistorialAnalisis.id == id, HistorialAnalisis.usuario_id == usuario.id
    ).first()
    if registro is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registro no encontrado")

    db.delete(registro)
    db.commit()
    return {"mensaje": "Registro eliminado"}


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
