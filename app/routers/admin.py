from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime
from app.data.db import get_db
from app.data.banco import Banco
from app.data.tarjeta import Tarjeta
from app.data.solicitud import Solicitud
from app.helpers import render
from app.security.auth import flash, is_logged_in, redirect_login

router = APIRouter(prefix="/admin", tags=["Admin"])

def require_admin(request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request):
        return redirect_login(request)
    if request.session.get("tipo") != "admin":
        flash(request, "No tienes permisos de administrador", "error")
        return RedirectResponse("/", status_code=302)
    return None

@router.get("", response_class=HTMLResponse)
@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request) or request.session.get("tipo") != "admin":
        return redirect_login(request)
    try:
        stats = {
            "total_bancos":           db.query(Banco).count(),
            "bancos_pendientes":      db.query(Banco).filter(Banco.aprobado == False).count(),
            "total_tarjetas":         db.query(Tarjeta).count(),
            "tarjetas_pendientes":    db.query(Tarjeta).filter(Tarjeta.aprobada == False).count(),
            "solicitudes_pendientes": db.query(Solicitud).filter(Solicitud.estado == "pendiente").count()
        }
        return render(request, "admin/dashboard.html", {"stats": stats})
    except Exception as e:
        flash(request, "Error al cargar el dashboard", "error")
        return RedirectResponse("/", status_code=302)

@router.get("/solicitudes", response_class=HTMLResponse)
async def solicitudes(request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request) or request.session.get("tipo") != "admin":
        return redirect_login(request)
    try:
        solicitudes = db.query(Solicitud).filter(Solicitud.estado == "pendiente").all()
        return render(request, "admin/solicitudes.html", {"solicitudes": solicitudes})
    except:
        return render(request, "admin/solicitudes.html", {"solicitudes": []})

@router.post("/solicitud/{id}/aprobar")
async def aprobar_solicitud(id: int, request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request) or request.session.get("tipo") != "admin":
        return redirect_login(request)
    try:
        solicitud = db.query(Solicitud).filter(Solicitud.id == id).first()
        if solicitud is None:
            raise Exception("No encontrada")
        solicitud.estado          = "aprobada"
        solicitud.fecha_respuesta = datetime.utcnow()
        if solicitud.tipo_solicitud == "banco":
            banco = db.query(Banco).filter(Banco.id == solicitud.referencia_id).first()
            if banco:
                banco.aprobado         = True
                banco.fecha_aprobacion = datetime.utcnow()
        elif solicitud.tipo_solicitud == "tarjeta":
            tarjeta = db.query(Tarjeta).filter(Tarjeta.id == solicitud.referencia_id).first()
            if tarjeta:
                tarjeta.aprobada         = True
                tarjeta.fecha_aprobacion = datetime.utcnow()
        db.commit()
        flash(request, "Solicitud aprobada correctamente", "success")
    except Exception as e:
        db.rollback()
        flash(request, "Error al aprobar la solicitud", "error")
    return RedirectResponse("/admin/solicitudes", status_code=302)

@router.post("/solicitud/{id}/rechazar")
async def rechazar_solicitud(
    id: int,
    request: Request,
    comentario: str = Form(""),
    db: Session = Depends(get_db)
):
    if not is_logged_in(request) or request.session.get("tipo") != "admin":
        return redirect_login(request)
    try:
        solicitud = db.query(Solicitud).filter(Solicitud.id == id).first()
        if solicitud is None:
            raise Exception("No encontrada")
        solicitud.estado           = "rechazada"
        solicitud.fecha_respuesta  = datetime.utcnow()
        solicitud.comentario_admin = comentario
        db.commit()
        flash(request, "Solicitud rechazada", "info")
    except Exception as e:
        db.rollback()
        flash(request, "Error al rechazar la solicitud", "error")
    return RedirectResponse("/admin/solicitudes", status_code=302)

@router.get("/bancos", response_class=HTMLResponse)
async def bancos(request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request) or request.session.get("tipo") != "admin":
        return redirect_login(request)
    try:
        bancos = db.query(Banco).all()
        return render(request, "admin/bancos.html", {"bancos": bancos})
    except:
        return render(request, "admin/bancos.html", {"bancos": []})

@router.get("/tarjetas", response_class=HTMLResponse)
async def tarjetas(request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request) or request.session.get("tipo") != "admin":
        return redirect_login(request)
    try:
        tarjetas = db.query(Tarjeta).all()
        return render(request, "admin/tarjetas.html", {"tarjetas": tarjetas})
    except:
        return render(request, "admin/tarjetas.html", {"tarjetas": []})

@router.post("/tarjeta/{id}/aprobar")
async def aprobar_tarjeta(id: int, request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request) or request.session.get("tipo") != "admin":
        return redirect_login(request)
    try:
        tarjeta = db.query(Tarjeta).filter(Tarjeta.id == id).first()
        if tarjeta is None:
            raise Exception("No encontrada")
        tarjeta.aprobada         = True
        tarjeta.fecha_aprobacion = datetime.utcnow()
        db.commit()
        flash(request, f"Tarjeta aprobada correctamente", "success")
    except Exception as e:
        db.rollback()
        flash(request, "Error al aprobar la tarjeta", "error")
    return RedirectResponse("/admin/tarjetas", status_code=302)
