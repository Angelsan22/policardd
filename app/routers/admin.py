from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
from app.data.db import get_db
from app.data.banco import Banco
from app.data.tarjeta import Tarjeta
from app.data.solicitud import Solicitud
from app.data.solicitud_tarjeta import SolicitudTarjeta
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
        tarjetas = db.query(Tarjeta).all()
        return render(request, "admin/dashboard.html", {"stats": stats, "tarjetas": tarjetas})
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

@router.get("/tarjeta/{id}/tendencia", response_class=JSONResponse)
async def tendencia_tarjeta(id: int, request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request) or request.session.get("tipo") != "admin":
        return JSONResponse(status_code=403, content={"error": "No autorizado"})

    tarjeta = db.query(Tarjeta).filter(Tarjeta.id == id).first()
    if not tarjeta:
        return JSONResponse(status_code=404, content={"error": "Tarjeta no encontrada"})

    # ── Histórico: últimas 12 semanas agrupadas (datos 100% reales) ──────────
    today = datetime.utcnow().date()
    HIST_WEEKS  = 12
    PROJ_WEEKS  = 8
    start_date  = today - timedelta(weeks=HIST_WEEKS)

    solicitudes = db.query(SolicitudTarjeta).filter(
        SolicitudTarjeta.tarjeta_id == id,
        SolicitudTarjeta.fecha_solicitud >= datetime.combine(start_date, datetime.min.time())
    ).all()

    # Contar todas las solicitudes de esta tarjeta (sin límite de fecha)
    total_apps = db.query(SolicitudTarjeta).filter(
        SolicitudTarjeta.tarjeta_id == id
    ).count()

    # Agrupar por semana (índice 0 = semana más antigua)
    weekly_counts = [0] * HIST_WEEKS
    for sol in solicitudes:
        days_ago = (today - sol.fecha_solicitud.date()).days
        week_idx = HIST_WEEKS - 1 - (days_ago // 7)
        if 0 <= week_idx < HIST_WEEKS:
            weekly_counts[week_idx] += 1

    # ── Proyección determinista: regresión lineal por mínimos cuadrados ──────
    n     = HIST_WEEKS
    xs    = list(range(n))                      # [0, 1, ..., 11]
    ys    = weekly_counts

    sum_x  = sum(xs)
    sum_y  = sum(ys)
    sum_xy = sum(x * y for x, y in zip(xs, ys))
    sum_x2 = sum(x * x for x in xs)

    denom = (n * sum_x2 - sum_x ** 2)
    if denom != 0:
        slope     = (n * sum_xy - sum_x * sum_y) / denom
        intercept = (sum_y - slope * sum_x) / n
    else:
        slope     = 0.0
        intercept = (sum_y / n) if n > 0 else 0.0

    # Generar proyección para las próximas PROJ_WEEKS semanas
    forecast_data = []
    for i in range(1, PROJ_WEEKS + 1):
        projected = intercept + slope * (n - 1 + i)
        forecast_data.append(max(0, round(projected, 1)))

    # ── Etiquetas semana a semana ─────────────────────────────────────────────
    labels = []
    for i in range(HIST_WEEKS):
        week_start = today - timedelta(weeks=(HIST_WEEKS - i))
        labels.append(week_start.strftime("Sem %d/%b"))

    for i in range(1, PROJ_WEEKS + 1):
        future_week = today + timedelta(weeks=i)
        labels.append(future_week.strftime("▶ %d/%b"))

    chart_data = [float(v) for v in weekly_counts] + forecast_data

    # ── Métricas e insight basados en datos reales ────────────────────────────
    avg_hist  = sum(weekly_counts) / HIST_WEEKS if HIST_WEEKS > 0 else 0
    last_4w   = sum(weekly_counts[-4:]) / 4 if len(weekly_counts) >= 4 else avg_hist
    first_4w  = sum(weekly_counts[:4])  / 4 if len(weekly_counts) >= 4 else avg_hist

    if slope > 0.1:
        tendencia_str = "ALCISTA "
        trend_text = (
            f"<b>{tarjeta.nombre}</b>: La demanda CRECE semana a semana "
            f"(+{slope:.2f} sols/sem). Total histórico: <b>{total_apps}</b> solicitudes."
        )
    elif slope < -0.1:
        tendencia_str = "BAJISTA "
        trend_text = (
            f"<b>{tarjeta.nombre}</b>: La demanda DECRECE "
            f"({slope:.2f} sols/sem). Total histórico: <b>{total_apps}</b> solicitudes."
        )
    else:
        tendencia_str = "ESTABLE "
        trend_text = (
            f"<b>{tarjeta.nombre}</b>: Demanda ESTABLE en las últimas 12 semanas. "
            f"Promedio: <b>{avg_hist:.1f} sols/sem</b> · Total: <b>{total_apps}</b>."
        )

    # Proyección acumulada para las próximas 8 semanas
    proj_total = round(sum(forecast_data))
    estado     = "Activa" if total_apps >= 5 else ("Baja Actividad" if total_apps > 0 else "Sin solicitudes")

    return {
        "trend_text":     trend_text,
        "metrics": [
            {"label": "Total Solicitudes", "value": str(total_apps)},
            {"label": "Tendencia",          "value": tendencia_str},
            {"label": "Proy. 8 Semanas",    "value": f"+{proj_total} sols."},
        ],
        "chart_labels":   labels,
        "chart_data":     chart_data,
        "history_length": HIST_WEEKS - 1,
    }
