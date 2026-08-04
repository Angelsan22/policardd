@extends('layout')
@section('title', 'Acceder — PoliCard')

@section('extra_styles')
<style>
.login-wrapper { min-height: 70vh; display: flex; align-items: center; justify-content: center; }
.login-box { width: 100%; max-width: 440px; background: var(--blanco); border-radius: var(--radio-lg); box-shadow: var(--sombra-lg); padding: 2.5rem; }
.login-header { text-align: center; margin-bottom: 2rem; }
.login-header .login-icon { width: 64px; height: 64px; background: var(--verde-oscuro); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--blanco); margin: 0 auto 1rem; }
.login-header h1 { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: var(--verde-oscuro); margin-bottom: 0.25rem; }
.login-header p { color: var(--verde-medio); font-size: 0.9rem; }
</style>
@endsection

@section('content')
<div class="login-wrapper">
    <div class="login-box">
        <div class="login-header">
            <div class="login-icon"><i class="fas fa-credit-card"></i></div>
            <h1>Bienvenido a PoliCard</h1>
            <p>Ingresa a tu cuenta para continuar</p>
        </div>

        <form method="POST" action="/login">
            @csrf
            <div class="form-group">
                <label>Correo electrónico</label>
                <input type="email" name="email" class="form-control" placeholder="correo@ejemplo.com" required value="{{ old('email', $email) }}">
            </div>
            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" name="password" class="form-control" placeholder="Tu contraseña" required>
            </div>
            <button type="submit" class="btn btn-primary btn-full btn-lg" style="margin-top:0.5rem;">
                <i class="fas fa-sign-in-alt"></i> Ingresar
            </button>
        </form>

        <div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid var(--gris-claro);">
            <p style="font-size:0.78rem; color:var(--verde-medio); text-align:center; line-height:1.5;">
                <i class="fas fa-shield-alt" style="color:var(--verde-salvia);"></i>
                Este acceso es solo para clientes. ¿Eres banco o administrador?
                <a href="{{ config('services.policard.web1_url') }}/login">Ingresa aquí</a>.
            </p>
        </div>
    </div>
</div>
@endsection
