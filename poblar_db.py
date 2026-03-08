
1764182556746_image.png
1764182569435_image.png

esto es el app.py from flask import Flask, render_template, request, flash, redirect, url_for from flask_sqlalchemy import SQLAlchemy from flask_wtf import FlaskForm from wtforms import StringField, IntegerField, SelectField from wtforms.validators import DataRequired, NumberRange app = Flask(_

pasted

hola estaba haciendo esto que te solicite en otro chat acerca de mi proyecto ya pude hacer todo lo del git y me quede hasta aqui de lo que me diste ---------------------------------------------------------------------------hola este es mi proyecto que cree en block de notas utilizando plantillas de pyhtpn levantando el entorno virtual para poder visualizar la url, ocupo que me ayudes a hacer unos ajustes que me pidieron que tuviera mi proyecto,  uno de esos cambios es que este alojado para que los maestros que van a evaluar mi proyecto puedan entrar a la url y visualizar el ptoyecto, ademas de cambiar colores, estilos y ▪ Caja negra ▪ Caja gris ▪ Caja blanca del proyecto dime que tengo que mandarte para que me ayudes-----------------------------------------------------------------------

¡Hola! Veo que ya tienes tu proyecto PoliCard funcionando localmente y ahora necesitas hacer algunos ajustes importantes. Déjame ayudarte paso a paso.

Lo que veo en tu proyecto:
Ya tienes:

✅ Flask app funcionando (app.py)
✅ Base de datos SQLite configurada
✅ Templates HTML con Tailwind CSS
✅ Sistema de navegación y búsqueda de tarjetas
Para ayudarte mejor, necesito que me envíes:
Los demás archivos HTML (los templates que están en la carpeta templates/):
index.html
tarjetas.html
buscar.html
educacion.html
calculadora.html
El archivo requirements.txt (si ya lo tienes)
Confirmación de lo que necesitas:
¿Quieres desplegar en Render (gratis) o prefieres otra plataforma?
¿Qué colores y estilos específicos quieres cambiar?
Para las pruebas de caja negra/gris/blanca: ¿ya tienes casos de prueba definidos o necesitas ayuda creándolos?
Mientras tanto, te adelanto los pasos principales:
1. Despliegue en Render (gratis)
Necesitarás crear estos archivos en tu proyecto:

requirements.txt
Procfile o configurar comando de inicio
Ajustes en app.py para producción
2. Cambios de diseño
Puedo ayudarte a mejorar los colores y estilos usando Tailwind CSS que ya tienes configurado.

3. Documentación de pruebas
Te ayudaré a crear la documentación de:

Caja negra: Pruebas de funcionalidad sin ver el código
Caja gris: Pruebas con conocimiento parcial
Caja blanca: Pruebas del código interno
¿Puedes enviarme los archivos HTML que te mencioné para empezar? Así podré darte una solución completa y funcional. 🚀

1764182860609_image.png
1764182928106_image.png
enfocate primero en la visualizacion  de la pagina y que la funcinalidad quede por completo bien y que puedan verlo las demas personas en sus dispositivos te paso lo que incluye las carpetas y la forma en la que esta distribuida para que lo entiendas ---------------------------------------------------------------------------------- y esto incluyen  dime que mas quieres ver

Perfecto, veo la estructura de tu proyecto. Para ayudarte con el despliegue y visualización completa, necesito ver el contenido de algunos archivos clave:

Archivos que necesito ver:
1. Archivos HTML en templates/ (Los más importantes):
index.html
buscar.html
calculadora.html
educacion.html
tarjetas.html
2. Archivos de configuración:
requirements.txt (para ver las dependencias)
render.yaml (si lo tienes)
El archivo app (parece ser tu app.py renombrado)
3. Scripts de base de datos:
poblar_db (para ver cómo poblas la base de datos)
¿Cómo me los puedes pasar?
Puedes copiar el contenido de cada archivo de esta manera:

# Para ver un archivo en terminal:
cat templates/index.html
O simplemente abre cada archivo y cópiame su contenido aquí en el chat.

Plan de acción una vez tenga los archivos:
✅ Verificar funcionalidad completa de todas las páginas
✅ Ajustar diseño y colores (mejorar UI/UX)
✅ Configurar despliegue en Render (para que sea accesible públicamente)
✅ Crear guía de pruebas (caja negra, gris, blanca)
✅ Generar URL pública para que los maestros accedan
¿Por cuál archivo empezamos? Te recomiendo empezar con index.html y app.py (o el archivo app que veo ahí). 🚀


{% extends 'base.html' %} {% block content %} <div class="max-w-4xl mx-auto"> <h1 class="text-4xl font-bold text-center mb-8 text-blue-600"><i class="fas fa-search mr-2"></i>Encuentra tu Tarjeta Ideal</h1> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"> <div class="bg-wh

pasted


{% extends 'base.html' %} {% block content %} <div class="max-w-4xl mx-auto"> <h1 class="text-4xl font-bold text-center mb-8 text-purple-600"><i class="fas fa-calculator mr-2"></i>Calculadora de Intereses</h1> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <div class="b

pasted


{% extends 'base.html' %} {% block content %} <div class="max-w-6xl mx-auto"> <h1 class="text-4xl font-bold text-center mb-8 text-purple-600"><i class="fas fa-graduation-cap mr-2"></i>Educación Financiera</h1> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <div class="b

pasted

index {% extends 'base.html' %}
{% block content %}
<div class="text-center mb-12">
<h1 class="text-5xl font-bold text-blue-600 mb-4 flex items-center justify-center">
    Bienvenido a PoliCard 
    <img src="{{ url_for('static', filename='images/logo.png') }}" alt="PoliCard Logo" class="h-24 ml-3">
</h1>
    <p class="text-xl text-gray-600">Tu guía completa para entender el mundo de las tarjetas de crédito</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
        <div class="text-center mb-4"><i class="fas fa-credit-card text-6xl text-blue-600"></i></div>
        <h3 class="text-xl font-bold mb-2 text-center">Explora Tarjetas</h3>
        <p class="text-gray-600 mb-4 text-center">Conoce las mejores tarjetas para jóvenes</p>
        <a href="/tarjetas" class="block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ver tarjetas</a>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
        <div class="text-center mb-4"><i class="fas fa-search text-6xl text-green-600"></i></div>
        <h3 class="text-xl font-bold mb-2 text-center">Busca tu Tarjeta</h3>
        <p class="text-gray-600 mb-4 text-center">Encuentra la tarjeta perfecta para ti</p>
        <a href="/buscar" class="block text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Buscar</a>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
        <div class="text-center mb-4"><i class="fas fa-graduation-cap text-6xl text-purple-600"></i></div>
        <h3 class="text-xl font-bold mb-2 text-center">Aprende</h3>
        <p class="text-gray-600 mb-4 text-center">Educación financiera básica</p>
        <a href="/educacion" class="block text-center bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Aprender</a>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
        <div class="text-center mb-4"><i class="fas fa-calculator text-6xl text-orange-600"></i></div>
        <h3 class="text-xl font-bold mb-2 text-center">Calcula</h3>
        <p class="text-gray-600 mb-4 text-center">Calculadora de intereses</p>
        <a href="/calculadora" class="block text-center bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Calcular</a>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
        <div class="text-center mb-4"><i class="fas fa-chart-line text-6xl text-red-600"></i></div>
        <h3 class="text-xl font-bold mb-2 text-center">Compara</h3>
        <p class="text-gray-600 mb-4 text-center">Compara diferentes tarjetas</p>
        <a href="/tarjetas" class="block text-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Comparar</a>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
        <div class="text-center mb-4"><i class="fas fa-info-circle text-6xl text-indigo-600"></i></div>
        <h3 class="text-xl font-bold mb-2 text-center">Información</h3>
        <p class="text-gray-600 mb-4 text-center">Términos importantes</p>
        <a href="/educacion" class="block text-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Ver más</a>
    </div>
</div>
{% endblock %}------------------------------------------------------------------------------------------------------------------buscar .. -----------------------------------------------------------------------------------------------------------calculadora.. -------------educacion..-----------------------------tarjetas.. {% extends 'base.html' %}
{% block content %}
<h1 class="text-4xl font-bold text-center mb-8 text-blue-600"><i class="fas fa-credit-card mr-2"></i>Catálogo de Tarjetas</h1>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {% for tarjeta in tarjetas %}
    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <div class="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4">
            <h3 class="text-xl font-bold">{{ tarjeta.nombre }}</h3>
            <p class="text-blue-100">{{ tarjeta.banco }}</p>
        </div>
        <div class="p-6">
            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold mb-4">
                {{ tarjeta.tipo|capitalize }}
            </span>

            <div class="space-y-3 mb-4">
                <div class="flex justify-between">
                    <span class="text-gray-600"><i class="fas fa-percentage mr-2"></i>CAT:</span>
                    <span class="font-bold text-lg">{{ tarjeta.cat }}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600"><i class="fas fa-dollar-sign mr-2"></i>Anualidad:</span>
                    <span class="font-bold">{% if tarjeta.anualidad == 0 %}<span class="text-green-600">GRATIS</span>{% else %}${{ tarjeta.anualidad|int }}{% endif %}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600"><i class="fas fa-user-clock mr-2"></i>Edad mínima:</span>
                    <span class="font-bold">{{ tarjeta.edad_minima }} años</span>
                </div>
            </div>
            <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm text-gray-700"><i class="fas fa-gift text-purple-600 mr-2"></i><strong>Beneficios:</strong> {{ tarjeta.beneficios }}</p>
            </div>
        </div>
    </div>
    {% endfor %}
</div>
{% endblock %}

Mostrar más
¡Perfecto! Ya tengo todos los archivos HTML. Ahora necesito ver algunos archivos más para completar el despliegue:

Archivos que me faltan:
1. requirements.txt
Este archivo lista las dependencias de Python. Cópiame su contenido completo.

2. El archivo app (o app.py)
Veo que ya me pasaste app.py al inicio, pero quiero confirmar que es la versión más reciente.

3. poblar_db (script para poblar la base de datos)
Necesito ver cómo insertas las tarjetas en la base de datos.

Mientras tanto, te adelanto los cambios que haré:
✨ Mejoras de diseño y funcionalidad:
Colores más modernos y atractivos - Paleta más vibrante
Animaciones suaves - Transiciones y efectos hover mejorados
Responsive mejorado - Se verá perfecto en móviles
Logo integrado correctamente en todas las páginas
Validaciones mejoradas en formularios
Efectos visuales en tarjetas y botones
🚀 Configuración para despliegue en Render:
Crearé estos archivos:

requirements.txt (si no está completo)
render.yaml (configuración de Render)
build.sh (script de construcción)
Ajustes en app.py para producción
¿Puedes pasarme estos 3 archivos?
bash
# Contenido de requirements.txt
cat requirements.txt

# Contenido del script de poblado
cat poblar_db

# Confirmar versión de app.py (si cambió)
cat app.py
Con esto podré darte la solución completa y lista para desplegar en los próximos minutos. 🎯


from flask import Flask, render_template, request, flash, redirect, url_for, session from flask_sqlalchemy import SQLAlchemy from flask_wtf import FlaskForm from wtforms import StringField, IntegerField, SelectField, TextAreaField, FloatField, PasswordField from wtforms.validators import DataReq

pasted

requeriements Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-WTF==1.2.1
WTForms==3.1.1
email-validator==2.1.0
Werkzeug==3.0.1
gunicorn==21.2.0--------------------------------------------------------------------------------------------------------------------------poblar from app import app, db, Tarjeta
with app.app_context():
    db.drop_all()
    db.create_all()

    tarjetas = [
        Tarjeta(nombre='BBVA Azul', banco='BBVA', tipo='estudiante', cat=45.5, anualidad=0, edad_minima=18, beneficios='Sin anualidad, cashback'),
        Tarjeta(nombre='Santander Like U', banco='Santander', tipo='joven', cat=42.0, anualidad=500, edad_minima=18, beneficios='Descuentos en entretenimiento'),
        Tarjeta(nombre='Banamex Tec', banco='Banamex', tipo='estudiante', cat=38.5, anualidad=0, edad_minima=18, beneficios='Sin anualidad, seguro'),
        Tarjeta(nombre='HSBC Zero', banco='HSBC', tipo='joven', cat=50.0, anualidad=0, edad_minima=21, beneficios='Meses sin intereses'),
        Tarjeta(nombre='Banorte Clásica', banco='Banorte', tipo='clasica', cat=55.0, anualidad=800, edad_minima=22, beneficios='Puntos recompensa'),
        Tarjeta(nombre='Nu Ultravioleta', banco='Nu', tipo='estudiante', cat=35.0, anualidad=0, edad_minima=18, beneficios='Cashback automático'),
    ]

    for tarjeta in tarjetas:
        db.session.add(tarjeta)

    db.session.commit()
    print("Base de datos creada exitosamente")---------------------------------app

Mostrar más
¡Perfecto! Ahora veo que tu proyecto tiene un sistema de autenticación completo con admin y bancos. Esto es más complejo de lo que pensé inicialmente.

Veo un problema crítico: tu poblar_db usa el modelo antiguo de Tarjeta (con campo banco como string), pero tu app.py nuevo usa un modelo relacional con banco_id (foreign key a la tabla Banco).

🎯 Plan de acción:
Voy a crear una versión completa y optimizada de tu proyecto con:

✅ Base de datos corregida - Compatible con el nuevo modelo
✅ Diseño mejorado - Colores modernos y animaciones
✅ Configuración para Render - Listo para desplegar
✅ Script de inicialización - Pobla la BD automáticamente
✅ Templates faltantes - Admin y Banco dashboards
📦 Archivos que voy a crear/actualizar:
1. Nuevo poblar_db.py (compatible con el modelo actual)
poblar_db.py - Script de inicialización
Código 
Ahora voy a crear los archivos necesarios para el despliegue en Render:

2. render.yaml - Configuración de Render
render.yaml - Configuración de Render
Código 
3. Procfile - Para Render/Heroku
Procfile
Código 
4. runtime.txt - Versión de Python
runtime.txt
Código 
5. app.py ACTUALIZADO - Con configuración para producción
app.py - Versión para producción
Código 


¿Cómo puedo ayudarle hoy?






from app import app, db, Usuario, Banco, Tarjeta, Solicitud
from werkzeug.security import generate_password_hash
from datetime import datetime

def poblar_base_datos():
    with app.app_context():
        # Limpiar base de datos
        print("🗑️  Limpiando base de datos...")
        db.drop_all()
        db.create_all()
        
        # 1. Crear usuario ADMIN
        print("👤 Creando usuario administrador...")
        admin = Usuario(
            email='admin@policard.com',
            password=generate_password_hash('admin123'),
            nombre='Administrador PoliCard',
            tipo='admin',
            activo=True
        )
        db.session.add(admin)
        db.session.commit()
        print("   ✅ Admin creado: admin@policard.com / admin123")
        
        # 2. Crear usuarios BANCO y sus bancos
        print("\n🏦 Creando bancos y usuarios...")
        
        bancos_data = [
            {
                'email': 'bbva@banco.com',
                'nombre': 'Representante BBVA',
                'nombre_banco': 'BBVA',
                'telefono': '55-1234-5678',
                'sitio_web': 'https://www.bbva.mx',
                'descripcion': 'BBVA México - Banco líder en servicios financieros'
            },
            {
                'email': 'santander@banco.com',
                'nombre': 'Representante Santander',
                'nombre_banco': 'Santander',
                'telefono': '55-2345-6789',
                'sitio_web': 'https://www.santander.com.mx',
                'descripcion': 'Banco Santander - Servicios financieros de calidad'
            },
            {
                'email': 'banamex@banco.com',
                'nombre': 'Representante Banamex',
                'nombre_banco': 'Banamex',
                'telefono': '55-3456-7890',
                'sitio_web': 'https://www.banamex.com',
                'descripcion': 'Banamex - Institución bancaria mexicana'
            },
            {
                'email': 'hsbc@banco.com',
                'nombre': 'Representante HSBC',
                'nombre_banco': 'HSBC',
                'telefono': '55-4567-8901',
                'sitio_web': 'https://www.hsbc.com.mx',
                'descripcion': 'HSBC México - Banco internacional'
            },
            {
                'email': 'banorte@banco.com',
                'nombre': 'Representante Banorte',
                'nombre_banco': 'Banorte',
                'telefono': '55-5678-9012',
                'sitio_web': 'https://www.banorte.com',
                'descripcion': 'Banorte - Banco mexicano de confianza'
            },
            {
                'email': 'nu@banco.com',
                'nombre': 'Representante Nu',
                'nombre_banco': 'Nu',
                'telefono': '55-6789-0123',
                'sitio_web': 'https://www.nu.com.mx',
                'descripcion': 'Nu - Banco digital innovador'
            }
        ]
        
        bancos_creados = []
        
        for banco_info in bancos_data:
            # Crear usuario del banco
            usuario_banco = Usuario(
                email=banco_info['email'],
                password=generate_password_hash('banco123'),
                nombre=banco_info['nombre'],
                tipo='banco',
                activo=True
            )
            db.session.add(usuario_banco)
            db.session.flush()
            
            # Crear banco
            banco = Banco(
                usuario_id=usuario_banco.id,
                nombre_banco=banco_info['nombre_banco'],
                telefono=banco_info['telefono'],
                sitio_web=banco_info['sitio_web'],
                descripcion=banco_info['descripcion'],
                aprobado=True,  # Ya aprobados para tener tarjetas
                fecha_aprobacion=datetime.utcnow()
            )
            db.session.add(banco)
            db.session.flush()
            
            bancos_creados.append(banco)
            print(f"   ✅ {banco_info['nombre_banco']}: {banco_info['email']} / banco123")
        
        db.session.commit()
        
        # 3. Crear TARJETAS para cada banco
        print("\n💳 Creando tarjetas...")
        
        tarjetas_data = [
            # BBVA
            {
                'nombre': 'BBVA Azul',
                'banco': 'BBVA',
                'tipo': 'estudiante',
                'cat': 45.5,
                'anualidad': 0,
                'edad_minima': 18,
                'beneficios': 'Sin anualidad, cashback del 1% en todas las compras, seguro de compra protegida'
            },
            {
                'nombre': 'BBVA Oro',
                'banco': 'BBVA',
                'tipo': 'clasica',
                'cat': 52.0,
                'anualidad': 1200,
                'edad_minima': 23,
                'beneficios': 'Puntos por cada compra, acceso a salas VIP, seguro de viaje'
            },
            # Santander
            {
                'nombre': 'Santander Like U',
                'banco': 'Santander',
                'tipo': 'joven',
                'cat': 42.0,
                'anualidad': 500,
                'edad_minima': 18,
                'beneficios': 'Descuentos en entretenimiento, 2x1 en cines, cashback en streaming'
            },
            {
                'nombre': 'Santander Free',
                'banco': 'Santander',
                'tipo': 'estudiante',
                'cat': 40.5,
                'anualidad': 0,
                'edad_minima': 18,
                'beneficios': 'Sin anualidad, descuentos en comercios afiliados, seguro básico'
            },
            # Banamex
            {
                'nombre': 'Banamex Tec',
                'banco': 'Banamex',
                'tipo': 'estudiante',
                'cat': 38.5,
                'anualidad': 0,
                'edad_minima': 18,
                'beneficios': 'Sin anualidad, seguro de accidentes, descuentos en tecnología'
            },
            {
                'nombre': 'Banamex Platinum',
                'banco': 'Banamex',
                'tipo': 'clasica',
                'cat': 48.0,
                'anualidad': 1500,
                'edad_minima': 25,
                'beneficios': 'Programa de puntos premium, concierge 24/7, seguro de viaje internacional'
            },
            # HSBC
            {
                'nombre': 'HSBC Zero',
                'banco': 'HSBC',
                'tipo': 'joven',
                'cat': 50.0,
                'anualidad': 0,
                'edad_minima': 21,
                'beneficios': 'Meses sin intereses en compras mayores, descuentos en gasolineras'
            },
            {
                'nombre': 'HSBC Advance',
                'banco': 'HSBC',
                'tipo': 'clasica',
                'cat': 54.0,
                'anualidad': 1800,
                'edad_minima': 24,
                'beneficios': 'Recompensas por compras, acceso a eventos exclusivos, seguros premium'
            },
            # Banorte
            {
                'nombre': 'Banorte Clásica',
                'banco': 'Banorte',
                'tipo': 'clasica',
                'cat': 55.0,
                'anualidad': 800,
                'edad_minima': 22,
                'beneficios': 'Puntos recompensa, protección de compras, asistencia en viajes'
            },
            {
                'nombre': 'Banorte Joven',
                'banco': 'Banorte',
                'tipo': 'joven',
                'cat': 44.0,
                'anualidad': 300,
                'edad_minima': 18,
                'beneficios': 'Descuentos en apps de delivery, cashback 0.5%, sin comisiones'
            },
            # Nu
            {
                'nombre': 'Nu Ultravioleta',
                'banco': 'Nu',
                'tipo': 'estudiante',
                'cat': 35.0,
                'anualidad': 0,
                'edad_minima': 18,
                'beneficios': 'Cashback automático del 1%, app innovadora, sin comisiones ocultas'
            },
            {
                'nombre': 'Nu Gold',
                'banco': 'Nu',
                'tipo': 'joven',
                'cat': 39.0,
                'anualidad': 0,
                'edad_minima': 20,
                'beneficios': 'Cashback del 2%, límite flexible, control total desde app'
            }
        ]
        
        for tarjeta_info in tarjetas_data:
            # Buscar el banco correspondiente
            banco = next((b for b in bancos_creados if b.nombre_banco == tarjeta_info['banco']), None)
            
            if banco:
                tarjeta = Tarjeta(
                    nombre=tarjeta_info['nombre'],
                    banco_id=banco.id,
                    tipo=tarjeta_info['tipo'],
                    cat=tarjeta_info['cat'],
                    anualidad=tarjeta_info['anualidad'],
                    edad_minima=tarjeta_info['edad_minima'],
                    beneficios=tarjeta_info['beneficios'],
                    aprobada=True,  # Ya aprobadas para que se muestren
                    fecha_aprobacion=datetime.utcnow()
                )
                db.session.add(tarjeta)
                print(f"   ✅ {tarjeta_info['nombre']} ({tarjeta_info['banco']})")
        
        db.session.commit()
        
        print("\n" + "="*60)
        print("🎉 ¡Base de datos poblada exitosamente!")
        print("="*60)
        print("\n📊 RESUMEN:")
        print(f"   • Usuarios: {Usuario.query.count()}")
        print(f"   • Bancos: {Banco.query.count()}")
        print(f"   • Tarjetas: {Tarjeta.query.count()}")
        print("\n🔑 CREDENCIALES:")
        print("   ADMIN:")
        print("   • Email: admin@policard.com")
        print("   • Password: admin123")
        print("\n   BANCOS (todos usan password: banco123):")
        for banco in bancos_creados:
            print(f"   • {banco.nombre_banco}: {banco.usuario.email}")
        print("\n" + "="*60)

if __name__ == '__main__':
    poblar_base_datos()
