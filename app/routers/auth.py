from fastapi import APIRouter, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash, check_password_hash
from app.data.db import get_db
from app.data.usuario import Usuario
from app.data.banco import Banco
from app.data.solicitud import Solicitud
from app.helpers import render
from app.security.auth import flash, is_logged_in, redirect_login

router = APIRouter(tags=["Autenticacion"])

@router.get("/login", response_class=HTMLResponse)
async def login_get(request: Request):
    if is_logged_in(request):
        return RedirectResponse("/dashboard", status_code=302)
    return render(request, "login.html", {"email": ""})

@router.post("/login", response_class=HTMLResponse)
async def login_post(
    request: Request,
    email:    str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        usuario = db.query(Usuario).filter(Usuario.email == email).first()
        if usuario and check_password_hash(usuario.password, password):
            request.session["usuario_id"] = usuario.id
            request.session["tipo"]       = usuario.tipo
            request.session["nombre"]     = usuario.nombre
            flash(request, f"Bienvenido {usuario.nombre}!", "success")
            return RedirectResponse("/dashboard", status_code=302)
        else:
            flash(request, "Email o contrasena incorrectos", "error")
    except Exception as e:
        flash(request, "Error al iniciar sesion", "error")
    return render(request, "login.html", {"email": email})

@router.get("/perfil", response_class=HTMLResponse)
async def perfil(request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request):
        return redirect_login(request)
    usuario    = db.query(Usuario).filter(Usuario.id == request.session["usuario_id"]).first()
    return render(request, "perfil.html")

@router.get("/registro_banco", response_class=HTMLResponse)
async def registro_banco_get(request: Request):
    return render(request, "registro_banco.html", {
        "email": "",
        "nombre_contacto": "",
        "nombre_banco": "",
        "telefono": "",
        "sitio_web": "",
        "descripcion": "",
    })

@router.post("/registro_banco", response_class=HTMLResponse)
async def registro_banco_post(
    request:         Request,
    email:           str = Form(...),
    password:        str = Form(...),
    confirm_password:str = Form(...),
    nombre_contacto: str = Form(...),
    nombre_banco:    str = Form(...),
    telefono:        str = Form(...),
    sitio_web:       str = Form(""),
    descripcion:     str = Form(""),
    db: Session = Depends(get_db)
):
    form_data = {
        "email": email,
        "nombre_contacto": nombre_contacto,
        "nombre_banco": nombre_banco,
        "telefono": telefono,
        "sitio_web": sitio_web,
        "descripcion": descripcion,
    }

    try:
        if password != confirm_password:
            flash(request, "Las contrasenas no coinciden", "error")
            return render(request, "registro_banco.html", form_data)
        if db.query(Usuario).filter(Usuario.email == email).first():
            flash(request, "Este email ya esta registrado", "error")
            return render(request, "registro_banco.html", form_data)

        usuario = Usuario(
            email    = email,
            password = generate_password_hash(password),
            nombre   = nombre_contacto,
            tipo     = "banco"
        )
        db.add(usuario)
        db.flush()

        banco = Banco(
            usuario_id   = usuario.id,
            nombre_banco = nombre_banco,
            telefono     = telefono,
            sitio_web    = sitio_web,
            descripcion  = descripcion
        )
        db.add(banco)
        db.flush()

        solicitud = Solicitud(
            banco_id       = banco.id,
            tipo_solicitud = "banco",
            referencia_id  = banco.id
        )
        db.add(solicitud)
        db.commit()
        flash(request, "Registro exitoso. Tu solicitud esta pendiente de aprobacion.", "success")
        return RedirectResponse("/login", status_code=302)
    except Exception as e:
        db.rollback()
        flash(request, "Error en el registro", "error")
        return render(request, "registro_banco.html", form_data)

@router.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/", status_code=302)

@router.get("/dashboard")
async def dashboard(request: Request, db: Session = Depends(get_db)):
    if not is_logged_in(request):
        return redirect_login(request)
    if request.session.get("tipo") == "admin":
        return RedirectResponse("/admin", status_code=302)
    elif request.session.get("tipo") == "banco":
        return RedirectResponse("/banco/dashboard", status_code=302)
    return RedirectResponse("/", status_code=302)
