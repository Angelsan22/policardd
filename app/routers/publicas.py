from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session, joinedload
from app.data.db import get_db
from app.data.tarjeta import Tarjeta
from app.data.banco import Banco
from app.data.solicitud_tarjeta import SolicitudTarjeta
from app.helpers import render
from app.security.auth import flash, is_logged_in

router = APIRouter(tags=["Publicas"])

@router.get("/", response_class=HTMLResponse)
async def index(request: Request, db: Session = Depends(get_db)):
    tipo = request.session.get("tipo")
    if tipo == "banco":
        from fastapi.responses import RedirectResponse
        return RedirectResponse("/banco/dashboard", status_code=302)
    if tipo == "admin":
        from fastapi.responses import RedirectResponse
        return RedirectResponse("/admin", status_code=302)

    # Stats dinámicos desde la BD
    tarjetas_aprobadas = db.query(Tarjeta).filter(Tarjeta.aprobada == True).all()
    total_tarjetas = len(tarjetas_aprobadas)
    total_bancos = db.query(Banco).filter(Banco.aprobado == True).count()

    if tarjetas_aprobadas:
        cat_min = min(t.cat for t in tarjetas_aprobadas)
        sin_anualidad = sum(1 for t in tarjetas_aprobadas if t.anualidad == 0)
        pct_sin_anualidad = round((sin_anualidad / total_tarjetas) * 100)
    else:
        cat_min = 0
        pct_sin_anualidad = 0

    home_stats = {
        "total_tarjetas": total_tarjetas,
        "total_bancos": total_bancos,
        "cat_min": cat_min,
        "pct_sin_anualidad": pct_sin_anualidad,
    }

    # Datos del cliente logueado
    mis_solicitudes = []
    mis_aprobadas = []
    usuario_id = request.session.get("usuario_id")
    if usuario_id and tipo == "cliente":
        todas = db.query(SolicitudTarjeta).options(
            joinedload(SolicitudTarjeta.tarjeta).joinedload(Tarjeta.banco)
        ).filter(
            SolicitudTarjeta.usuario_id == usuario_id
        ).order_by(SolicitudTarjeta.fecha_solicitud.desc()).all()

        mis_solicitudes = todas
        mis_aprobadas = [s for s in todas if s.estado == "aprobada"]

    return render(request, "index.html", {
        "home_stats": home_stats,
        "mis_solicitudes": mis_solicitudes,
        "mis_aprobadas": mis_aprobadas,
    })

@router.get("/tarjetas", response_class=HTMLResponse)
async def tarjetas(request: Request, db: Session = Depends(get_db)):
    try:
        todas = db.query(Tarjeta).filter(Tarjeta.aprobada == True).all()
        return render(request, "tarjetas.html", {"tarjetas": todas})
    except Exception as e:
        flash(request, "Error al cargar las tarjetas", "error")
        return render(request, "tarjetas.html", {"tarjetas": []})

@router.get("/buscar", response_class=HTMLResponse)
async def buscar(request: Request, db: Session = Depends(get_db)):
    tipo          = request.query_params.get("tipo", "").strip()
    cat_max       = request.query_params.get("cat_max", "").strip()
    anualidad_max = request.query_params.get("anualidad_max", "").strip()
    edad          = request.query_params.get("edad", "").strip()

    filtros = {
        "tipo": tipo,
        "cat_max": cat_max,
        "anualidad_max": anualidad_max,
        "edad": edad,
    }

    if not any([tipo, cat_max, anualidad_max, edad]):
        return render(request, "buscar.html", filtros)

    try:
        query = db.query(Tarjeta).filter(Tarjeta.aprobada == True)
        if tipo:
            query = query.filter(Tarjeta.tipo == tipo)
        if cat_max:
            query = query.filter(Tarjeta.cat <= float(cat_max))
        if anualidad_max:
            query = query.filter(Tarjeta.anualidad <= float(anualidad_max))
        if edad:
            query = query.filter(Tarjeta.edad_minima <= int(edad))
        resultado = query.order_by(Tarjeta.cat.asc()).all()
        return render(request, "buscar.html", {"tarjetas": resultado, **filtros})
    except Exception as e:
        flash(request, "Error al realizar la busqueda", "error")
        return render(request, "buscar.html", {"tarjetas": [], **filtros})

@router.get("/educacion", response_class=HTMLResponse)
async def educacion(request: Request):
    return render(request, "educacion.html")

@router.get("/calculadora", response_class=HTMLResponse)
async def calculadora(request: Request):
    return render(request, "calculadora.html")
