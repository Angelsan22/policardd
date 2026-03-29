from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from datetime import datetime
from werkzeug.security import generate_password_hash
from app.data.db import get_db
from app.data.usuario import Usuario
from app.data.usuario_cliente import UsuarioCliente
from app.data.tarjeta import Tarjeta
from app.data.solicitud_tarjeta import SolicitudTarjeta
from app.helpers import render
from app.security.auth import flash, is_logged_in, redirect_login

router = APIRouter(tags=["Cliente"])

@router.get("/registro", response_class=HTMLResponse)
async def registro_get(request: Request):
    if is_logged_in(request):
        return RedirectResponse("/", status_code=302)
    return render(request, "registro_usuario.html", {
        "nombre": "",
        "email": "",
        "telefono": "",
        "fecha_nacimiento": "",
        "direccion": "",
    })

@router.post("/registro", response_class=HTMLResponse)
async def registro_post(
    request:          Request,
    nombre:           str = Form(...),
    email:            str = Form(...),
    password:         str = Form(...),
    confirm_password: str = Form(...),
    telefono:         str = Form(...),
    fecha_nacimiento: str = Form(...),
    direccion:        str = Form(...),
    db: Session = Depends(get_db)
):
    form_data = {
        "nombre": nombre,
        "email": email,
        "telefono": telefono,
        "fecha_nacimiento": fecha_nacimiento,
        "direccion": direccion,
    }

    try:
        if password != confirm_password:
            flash(request, "Las contrasenas no coinciden", "error")
            return render(request, "registro_usuario.html", form_data)
        if db.query(Usuario).filter(Usuario.email == email).first():
            flash(request, "Este email ya esta registrado", "error")
            return render(request, "registro_usuario.html", form_data)

        fecha = datetime.strptime(fecha_nacimiento, "%Y-%m-%d").date()
        usuario = Usuario(
            email    = email,
            password = generate_password_hash(password),
            nombre   = nombre,
            tipo     = "cliente"
        )
        db.add(usuario)
        db.flush()

        cliente = UsuarioCliente(
            usuario_id       = usuario.id,
            telefono         = telefono,
            fecha_nacimiento = fecha,
            direccion        = direccion
        )
        db.add(cliente)
        db.commit()
        flash(request, "Registro exitoso! Ya puedes iniciar sesion.", "success")
        return RedirectResponse("/login", status_code=302)
    except Exception as e:
        db.rollback()
        flash(request, "Error en el registro", "error")
        return render(request, "registro_usuario.html", form_data)

@router.post("/tarjeta/{id}/solicitar")
async def solicitar_tarjeta(id: int, request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request):
        return redirect_login(request)
    try:
        usuario = db.query(Usuario).filter(Usuario.id == request.session["usuario_id"]).first()
        if usuario.tipo != "cliente":
            flash(request, "Solo usuarios registrados pueden solicitar tarjetas", "warning")
            return RedirectResponse("/tarjetas", status_code=302)

        tarjeta = db.query(Tarjeta).filter(Tarjeta.id == id).first()
        if tarjeta is None:
            flash(request, "Tarjeta no encontrada", "error")
            return RedirectResponse("/tarjetas", status_code=302)

        ya_solicitada = db.query(SolicitudTarjeta).filter(
            SolicitudTarjeta.usuario_id == usuario.id,
            SolicitudTarjeta.tarjeta_id == id
        ).first()
        if ya_solicitada:
            flash(request, "Ya solicitaste esta tarjeta anteriormente", "warning")
            return RedirectResponse("/tarjetas", status_code=302)

        sol = SolicitudTarjeta(usuario_id=usuario.id, tarjeta_id=id)
        db.add(sol)
        db.commit()
        flash(request, f"Solicitud enviada! El banco revisara tu solicitud.", "success")
    except Exception as e:
        db.rollback()
        flash(request, "Error al enviar la solicitud", "error")
    return RedirectResponse("/tarjetas", status_code=302)
