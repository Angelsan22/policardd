from app.data.db import SessionLocal
from app.data.usuario import Usuario
from app.data.banco import Banco
from app.data.tarjeta import Tarjeta
from app.data.solicitud import Solicitud
from werkzeug.security import generate_password_hash
from datetime import datetime

def init_db():
    db = SessionLocal()
    try:
        if not db.query(Usuario).filter(Usuario.email == "admin@policard.com").first():
            admin = Usuario(
                email    = "admin@policard.com",
                password = generate_password_hash("AdminPoliCard2025!"),
                nombre   = "Administrador",
                tipo     = "admin"
            )
            db.add(admin)
            db.commit()
            print("Admin creado: admin@policard.com / AdminPoliCard2025!")

        if db.query(Tarjeta).count() == 0:
            bancos_data = [
                {"email": "bbva@banco.com",      "nombre": "Rep. BBVA",      "banco": "BBVA Mexico"},
                {"email": "santander@banco.com", "nombre": "Rep. Santander", "banco": "Santander"},
                {"email": "banamex@banco.com",   "nombre": "Rep. Banamex",   "banco": "Citibanamex"},
                {"email": "hsbc@banco.com",      "nombre": "Rep. HSBC",      "banco": "HSBC"},
                {"email": "banorte@banco.com",   "nombre": "Rep. Banorte",   "banco": "Banorte"},
                {"email": "nu@banco.com",        "nombre": "Rep. Nu",        "banco": "Nu Mexico"},
            ]
            bancos_creados = {}
            for bd in bancos_data:
                if not db.query(Usuario).filter(Usuario.email == bd["email"]).first():
                    u = Usuario(
                        email    = bd["email"],
                        password = generate_password_hash("banco123"),
                        nombre   = bd["nombre"],
                        tipo     = "banco"
                    )
                    db.add(u)
                    db.flush()
                    b = Banco(
                        usuario_id       = u.id,
                        nombre_banco     = bd["banco"],
                        aprobado         = True,
                        fecha_aprobacion = datetime.utcnow()
                    )
                    db.add(b)
                    db.flush()
                    bancos_creados[bd["banco"]] = b

            tarjetas_data = [
                ("BBVA Azul Estudiante",   "BBVA Mexico",  "estudiante", 24.5, 0,    18, "Sin anualidad, cashback 3% en gastos escolares"),
                ("BBVA Oro Joven",         "BBVA Mexico",  "joven",      26.8, 450,  21, "Puntos BBVA, acceso a promociones exclusivas"),
                ("BBVA Platino Clasica",   "BBVA Mexico",  "clasica",    29.2, 800,  25, "Salas VIP, asistencia medica, reembolso en gasolina"),
                ("Santander Like U",       "Santander",    "joven",      28.0, 0,    18, "Sin anualidad, descuentos en Spotify y Netflix"),
                ("Santander Free",         "Santander",    "estudiante", 25.5, 0,    18, "Sin anualidad, seguro de accidentes"),
                ("Citibanamex Estudiante", "Citibanamex",  "estudiante", 22.0, 0,    18, "Sin anualidad, cashback 1%"),
                ("Citibanamex Platinum",   "Citibanamex",  "clasica",    31.0, 1500, 25, "Puntos ThankYou, concierge 24/7"),
                ("HSBC Zero",              "HSBC",         "joven",      30.0, 0,    21, "Sin anualidad, MSI en compras"),
                ("HSBC Advance",           "HSBC",         "clasica",    33.0, 1800, 24, "Recompensas, eventos exclusivos"),
                ("Banorte Joven",          "Banorte",      "joven",      27.0, 300,  18, "Cashback 0.5%, descuentos en delivery"),
                ("Nu Ultravioleta",        "Nu Mexico",    "estudiante", 35.0, 0,    18, "Cashback automatico 1%, sin comisiones"),
                ("Nu Gold",                "Nu Mexico",    "joven",      39.0, 0,    20, "Cashback 2%, limite flexible"),
            ]
            for nombre, banco_n, tipo, cat, anualidad, edad, beneficios in tarjetas_data:
                banco = bancos_creados.get(banco_n)
                if banco:
                    t = Tarjeta(
                        nombre           = nombre,
                        banco_id         = banco.id,
                        tipo             = tipo,
                        cat              = cat,
                        anualidad        = anualidad,
                        edad_minima      = edad,
                        beneficios       = beneficios,
                        aprobada         = True,
                        fecha_aprobacion = datetime.utcnow()
                    )
                    db.add(t)
            db.commit()
            print("Datos de prueba creados.")

    except Exception as e:
        db.rollback()
        print(f"Error inicializando BD: {e}")
    finally:
        db.close()
