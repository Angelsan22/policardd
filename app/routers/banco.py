from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session, joinedload
from app.data.db import get_db
from app.data.usuario import Usuario
from app.data.usuario_cliente import UsuarioCliente
from app.data.tarjeta import Tarjeta
from app.data.solicitud import Solicitud
from app.data.solicitud_tarjeta import SolicitudTarjeta
from app.helpers import render
from app.security.auth import flash, is_logged_in, redirect_login

router = APIRouter(prefix="/banco", tags=["Banco"])

def get_banco_usuario(request: Request, db: Session):
    if not is_logged_in(request) or request.session.get("tipo") != "banco":
        return None, None
    usuario = db.query(Usuario).filter(Usuario.id == request.session["usuario_id"]).first()
    if not usuario or not usuario.banco:
        return None, None
    return usuario, usuario.banco

@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        tarjeta_ids = [t.id for t in banco.tarjetas]
        solicitudes_clientes = db.query(SolicitudTarjeta).filter(
            SolicitudTarjeta.tarjeta_id.in_(tarjeta_ids),
            SolicitudTarjeta.estado == "pendiente"
        ).count() if tarjeta_ids else 0

        stats = {
            "tarjetas_count":         len(banco.tarjetas),
            "tarjetas_aprobadas":     sum(1 for t in banco.tarjetas if t.aprobada),
            "solicitudes_pendientes": db.query(Solicitud).filter(Solicitud.banco_id == banco.id, Solicitud.estado == "pendiente").count(),
            "banco_aprobado":         banco.aprobado,
            "solicitudes_clientes":   solicitudes_clientes,
            "clientes_activos":       db.query(SolicitudTarjeta).filter(SolicitudTarjeta.tarjeta_id.in_(tarjeta_ids), SolicitudTarjeta.estado == "aprobada").count() if tarjeta_ids else 0
        }
        return render(request, "banco/bancodashboard.html", {"banco": banco, "stats": stats})
    except Exception as e:
        flash(request, "Error al cargar el dashboard", "error")
        return RedirectResponse("/", status_code=302)

@router.post("/perfil/editar")
async def editar_perfil(
    request: Request,
    nombre_banco: str = Form(...),
    telefono: str = Form(None),
    sitio_web: str = Form(None),
    descripcion: str = Form(None),
    db: Session = Depends(get_db)
):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        banco.nombre_banco = nombre_banco
        banco.telefono     = telefono
        banco.sitio_web    = sitio_web
        banco.descripcion  = descripcion
        db.commit()
        flash(request, "Perfil del banco actualizado correctamente", "success")
    except Exception as e:
        db.rollback()
        flash(request, "Error al actualizar el perfil", "error")
    return RedirectResponse("/banco/dashboard", status_code=302)

@router.get("/tarjetas", response_class=HTMLResponse)
async def tarjetas(request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        return render(request, "banco/tarjetas.html", {"tarjetas": banco.tarjetas, "banco": banco})
    except Exception as e:
        flash(request, "Error al cargar tarjetas", "error")
        return RedirectResponse("/banco/dashboard", status_code=302)

@router.get("/tarjeta/nueva", response_class=HTMLResponse)
async def nueva_tarjeta_get(request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    if not banco.aprobado:
        flash(request, "Tu banco debe estar aprobado para crear tarjetas", "warning")
        return RedirectResponse("/banco/dashboard", status_code=302)
    return render(request, "banco/tarjeta_form.html", {"titulo": "Nueva Tarjeta"})

@router.post("/tarjeta/nueva", response_class=HTMLResponse)
async def nueva_tarjeta_post(
    request:     Request,
    nombre:      str   = Form(...),
    tipo:        str   = Form(...),
    cat:         float = Form(...),
    anualidad:   float = Form(...),
    edad_minima: int   = Form(...),
    beneficios:  str   = Form(""),
    imagen_url:  str   = Form(""),
    db: Session = Depends(get_db)
):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        tarjeta = Tarjeta(
            nombre=nombre, banco_id=banco.id, tipo=tipo,
            cat=cat, anualidad=anualidad, edad_minima=edad_minima,
            beneficios=beneficios, imagen_url=imagen_url
        )
        db.add(tarjeta)
        db.flush()
        solicitud = Solicitud(banco_id=banco.id, tipo_solicitud="tarjeta", referencia_id=tarjeta.id)
        db.add(solicitud)
        db.commit()
        flash(request, "Tarjeta enviada para aprobacion", "success")
        return RedirectResponse("/banco/tarjetas", status_code=302)
    except Exception as e:
        db.rollback()
        flash(request, "Error al crear la tarjeta", "error")
        return render(request, "banco/tarjeta_form.html", {"titulo": "Nueva Tarjeta"})

@router.get("/tarjeta/{id}/editar", response_class=HTMLResponse)
async def editar_tarjeta_get(id: int, request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    tarjeta = db.query(Tarjeta).filter(Tarjeta.id == id, Tarjeta.banco_id == banco.id).first()
    if tarjeta is None:
        flash(request, "Tarjeta no encontrada", "error")
        return RedirectResponse("/banco/tarjetas", status_code=302)
    return render(request, "banco/tarjeta_form.html", {"titulo": "Editar Tarjeta", "tarjeta": tarjeta})

@router.post("/tarjeta/{id}/editar", response_class=HTMLResponse)
async def editar_tarjeta_post(
    id: int, request: Request,
    nombre: str = Form(...), tipo: str = Form(...),
    cat: float = Form(...), anualidad: float = Form(...),
    edad_minima: int = Form(...), beneficios: str = Form(""),
    imagen_url: str = Form(""),
    db: Session = Depends(get_db)
):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        tarjeta = db.query(Tarjeta).filter(Tarjeta.id == id, Tarjeta.banco_id == banco.id).first()
        if tarjeta is None:
            raise Exception("No encontrada")
        tarjeta.nombre=nombre; tarjeta.tipo=tipo; tarjeta.cat=cat
        tarjeta.anualidad=anualidad; tarjeta.edad_minima=edad_minima
        tarjeta.beneficios=beneficios; tarjeta.imagen_url=imagen_url
        tarjeta.aprobada = False
        solicitud = Solicitud(banco_id=banco.id, tipo_solicitud="tarjeta", referencia_id=tarjeta.id)
        db.add(solicitud)
        db.commit()
        flash(request, "Tarjeta actualizada. Pendiente de aprobacion.", "success")
        return RedirectResponse("/banco/tarjetas", status_code=302)
    except Exception as e:
        db.rollback()
        flash(request, "Error al editar la tarjeta", "error")
        return RedirectResponse("/banco/tarjetas", status_code=302)

@router.post("/tarjeta/{id}/eliminar")
async def eliminar_tarjeta(id: int, request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        tarjeta = db.query(Tarjeta).filter(Tarjeta.id == id, Tarjeta.banco_id == banco.id).first()
        if tarjeta is None:
            raise Exception("No encontrada")
        db.delete(tarjeta)
        db.commit()
        flash(request, "Tarjeta eliminada exitosamente", "success")
    except Exception as e:
        db.rollback()
        flash(request, "Error al eliminar la tarjeta", "error")
    return RedirectResponse("/banco/tarjetas", status_code=302)

@router.get("/solicitudes-clientes", response_class=HTMLResponse)
async def solicitudes_clientes(request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        tarjeta_ids = [t.id for t in banco.tarjetas]
        solicitudes = db.query(SolicitudTarjeta).options(
            joinedload(SolicitudTarjeta.usuario).joinedload(Usuario.cliente)
        ).filter(
            SolicitudTarjeta.tarjeta_id.in_(tarjeta_ids)
        ).order_by(SolicitudTarjeta.fecha_solicitud.desc()).all() if tarjeta_ids else []
        return render(request, "banco/solicitudes_clientes.html", {"solicitudes": solicitudes})
    except Exception as e:
        flash(request, "Error al cargar solicitudes", "error")
        return RedirectResponse("/banco/dashboard", status_code=302)

@router.post("/solicitud-cliente/{id}/aprobar")
async def aprobar_solicitud_cliente(id: int, request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        sol = db.query(SolicitudTarjeta).filter(SolicitudTarjeta.id == id).first()
        if sol is None:
            raise Exception("No encontrada")
        sol.estado = "aprobada"
        db.commit()
        flash(request, "Solicitud aprobada", "success")
    except:
        db.rollback()
        flash(request, "Error al aprobar", "error")
    return RedirectResponse("/banco/solicitudes-clientes", status_code=302)

@router.post("/solicitud-cliente/{id}/rechazar")
async def rechazar_solicitud_cliente(id: int, request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        sol = db.query(SolicitudTarjeta).filter(SolicitudTarjeta.id == id).first()
        if sol is None:
            raise Exception("No encontrada")
        sol.estado = "rechazada"
        db.commit()
        flash(request, "Solicitud rechazada", "info")
    except:
        db.rollback()
        flash(request, "Error al rechazar", "error")
    return RedirectResponse("/banco/solicitudes-clientes", status_code=302)

@router.get("/clientes", response_class=HTMLResponse)
async def clientes_aprobados(request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        tarjeta_ids = [t.id for t in banco.tarjetas]
        solicitudes = db.query(SolicitudTarjeta).options(
            joinedload(SolicitudTarjeta.usuario).joinedload(Usuario.cliente)
        ).filter(
            SolicitudTarjeta.tarjeta_id.in_(tarjeta_ids),
            SolicitudTarjeta.estado == "aprobada"
        ).order_by(SolicitudTarjeta.fecha_solicitud.desc()).all() if tarjeta_ids else []
        return render(request, "banco/clientes_aprobados.html", {"solicitudes": solicitudes})
    except Exception as e:
        flash(request, "Error al cargar clientes vinculados", "error")
        return RedirectResponse("/banco/dashboard", status_code=302)

@router.post("/clientes/{id}/cancelar")
async def cancelar_tarjeta_cliente(id: int, request: Request, db: Session = Depends(get_db)):
    usuario, banco = get_banco_usuario(request, db)
    if not banco:
        return redirect_login(request)
    try:
        sol = db.query(SolicitudTarjeta).filter(SolicitudTarjeta.id == id).first()
        if sol is None:
            raise Exception("No encontrada")
        # Simplemente cambiamos el estado de aprobada a cancelada
        sol.estado = "cancelada"
        db.commit()
        flash(request, "La tarjeta del cliente ha sido cancelada exitosamente.", "info")
    except:
        db.rollback()
        flash(request, "Error al cancelar la tarjeta", "error")
    return RedirectResponse("/banco/clientes", status_code=302)
