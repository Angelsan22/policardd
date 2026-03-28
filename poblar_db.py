from app import app, db, Usuario, Banco, Tarjeta, Solicitud
from werkzeug.security import generate_password_hash
from datetime import datetime


def poblar_base_datos():
    with app.app_context():
        db.drop_all()
        db.create_all()

        admin = Usuario(
            email='admin@policard.com',
            password=generate_password_hash('admin123'),
            nombre='Administrador PoliCard',
            tipo='admin',
            activo=True
        )
        db.session.add(admin)
        db.session.commit()

        bancos_data = [
            {'email': 'bbva@banco.com',      'nombre': 'Representante BBVA',      'nombre_banco': 'BBVA',      'telefono': '55-1234-5678', 'sitio_web': 'https://www.bbva.mx',          'descripcion': 'BBVA México - Banco líder en servicios financieros'},
            {'email': 'santander@banco.com', 'nombre': 'Representante Santander', 'nombre_banco': 'Santander', 'telefono': '55-2345-6789', 'sitio_web': 'https://www.santander.com.mx', 'descripcion': 'Banco Santander - Servicios financieros de calidad'},
            {'email': 'banamex@banco.com',   'nombre': 'Representante Banamex',   'nombre_banco': 'Banamex',   'telefono': '55-3456-7890', 'sitio_web': 'https://www.banamex.com',      'descripcion': 'Banamex - Institución bancaria mexicana'},
            {'email': 'hsbc@banco.com',      'nombre': 'Representante HSBC',      'nombre_banco': 'HSBC',      'telefono': '55-4567-8901', 'sitio_web': 'https://www.hsbc.com.mx',      'descripcion': 'HSBC México - Banco internacional'},
            {'email': 'banorte@banco.com',   'nombre': 'Representante Banorte',   'nombre_banco': 'Banorte',   'telefono': '55-5678-9012', 'sitio_web': 'https://www.banorte.com',      'descripcion': 'Banorte - Banco mexicano de confianza'},
            {'email': 'nu@banco.com',        'nombre': 'Representante Nu',        'nombre_banco': 'Nu',        'telefono': '55-6789-0123', 'sitio_web': 'https://www.nu.com.mx',        'descripcion': 'Nu - Banco digital innovador'},
        ]

        bancos_creados = []
        for info in bancos_data:
            u = Usuario(
                email=info['email'],
                password=generate_password_hash('banco123'),
                nombre=info['nombre'],
                tipo='banco',
                activo=True
            )
            db.session.add(u)
            db.session.flush()
            b = Banco(
                usuario_id=u.id,
                nombre_banco=info['nombre_banco'],
                telefono=info['telefono'],
                sitio_web=info['sitio_web'],
                descripcion=info['descripcion'],
                aprobado=True,
                fecha_aprobacion=datetime.utcnow()
            )
            db.session.add(b)
            db.session.flush()
            bancos_creados.append(b)

        solicitud = Solicitud(
            banco_id=b.id,
            tipo_solicitud='banco',
            referencia_id=b.id,
            estado='pendiente'
        )
        db.session.add(solicitud)

        db.session.commit()

        tarjetas_data = [
            ('BBVA Azul',          'BBVA',      'estudiante', 45.5, 0,    18, 'Sin anualidad, cashback del 1%, seguro de compra protegida'),
            ('BBVA Oro',           'BBVA',      'clasica',    52.0, 1200, 23, 'Puntos por cada compra, acceso a salas VIP, seguro de viaje'),
            ('Santander Like U',   'Santander', 'joven',      42.0, 500,  18, 'Descuentos en entretenimiento, 2x1 en cines, cashback en streaming'),
            ('Santander Free',     'Santander', 'estudiante', 40.5, 0,    18, 'Sin anualidad, descuentos en comercios afiliados, seguro básico'),
            ('Banamex Tec',        'Banamex',   'estudiante', 38.5, 0,    18, 'Sin anualidad, seguro de accidentes, descuentos en tecnología'),
            ('Banamex Platinum',   'Banamex',   'clasica',    48.0, 1500, 25, 'Programa de puntos premium, concierge 24/7, seguro de viaje internacional'),
            ('HSBC Zero',          'HSBC',      'joven',      50.0, 0,    21, 'Meses sin intereses en compras mayores, descuentos en gasolineras'),
            ('HSBC Advance',       'HSBC',      'clasica',    54.0, 1800, 24, 'Recompensas por compras, acceso a eventos exclusivos, seguros premium'),
            ('Banorte Clásica',    'Banorte',   'clasica',    55.0, 800,  22, 'Puntos recompensa, protección de compras, asistencia en viajes'),
            ('Banorte Joven',      'Banorte',   'joven',      44.0, 300,  18, 'Descuentos en apps de delivery, cashback 0.5%, sin comisiones'),
            ('Nu Ultravioleta',    'Nu',        'estudiante', 35.0, 0,    18, 'Cashback automático del 1%, app innovadora, sin comisiones ocultas'),
            ('Nu Gold',            'Nu',        'joven',      39.0, 0,    20, 'Cashback del 2%, límite flexible, control total desde app'),
        ]

        for nombre, banco_nombre, tipo, cat, anualidad, edad, beneficios in tarjetas_data:
            banco = next((b for b in bancos_creados if b.nombre_banco == banco_nombre), None)
            if banco:
                t = Tarjeta(
                    nombre=nombre,
                    banco_id=banco.id,
                    tipo=tipo,
                    cat=cat,
                    anualidad=anualidad,
                    edad_minima=edad,
                    beneficios=beneficios,
                    aprobada=True,
                    fecha_aprobacion=datetime.utcnow()
                )
                db.session.add(t)

        db.session.commit()

        print(" Base de datos poblada exitosamente")
        print(f"   Usuarios : {Usuario.query.count()}")
        print(f"   Bancos   : {Banco.query.count()}")
        print(f"   Tarjetas : {Tarjeta.query.count()}")
        print("\nCredenciales:")
        print("   Admin  → admin@policard.com / admin123")
        print("   Bancos → <email_banco> / banco123")


if __name__ == '__main__':
    poblar_base_datos()