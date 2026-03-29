from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from app.data.db import get_db
from app.data.tarjeta import Tarjeta
from app.helpers import render
from app.security.auth import flash

router = APIRouter(tags=["Publicas"])

@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    tipo = request.session.get("tipo")
    if tipo == "banco":
        from fastapi.responses import RedirectResponse
        return RedirectResponse("/banco/dashboard", status_code=302)
    if tipo == "admin":
        from fastapi.responses import RedirectResponse
        return RedirectResponse("/admin", status_code=302)
    return render(request, "index.html")

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
