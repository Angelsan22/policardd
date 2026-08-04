@extends('layout')
@section('title', 'Mi Perfil — PoliCard')

@section('extra_styles')
<style>
.perfil-wrapper { min-height: 70vh; display: flex; align-items: center; justify-content: center; }
.perfil-box { width: 100%; max-width: 480px; background: var(--blanco); border-radius: var(--radio-lg); box-shadow: var(--sombra-lg); padding: 2.5rem; }
.perfil-header { text-align: center; margin-bottom: 2rem; }
.perfil-header .perfil-icon { width: 64px; height: 64px; background: var(--verde-oscuro); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--blanco); margin: 0 auto 1rem; overflow: hidden; }
.perfil-header .perfil-icon img { width: 100%; height: 100%; object-fit: cover; }
.perfil-header h1 { font-family: 'DM Serif Display', serif; font-size: 1.6rem; color: var(--verde-oscuro); margin-bottom: 0.25rem; }
.perfil-header p { color: var(--verde-medio); font-size: 0.9rem; }
</style>
@endsection

@section('content')
<div class="perfil-wrapper">
    <div class="perfil-box">
        <div class="perfil-header">
            <div class="perfil-icon">
                @if ($usuario && !empty($usuario['foto_url']))
                    <img src="{{ config('services.policard.web1_url').$usuario['foto_url'] }}" alt="Foto de perfil">
                @else
                    <i class="fas fa-user-circle"></i>
                @endif
            </div>
            <h1>Mi Perfil</h1>
            <p>{{ $usuario['nombre'] ?? '' }} · {{ $usuario['email'] ?? '' }}</p>
        </div>

        <div style="margin-top: 1.5rem; text-align: center;">
            <p style="color: var(--verde-medio); margin-bottom: 1.5rem;">
                Actualmente tu cuenta está protegida con contraseña estándar.
            </p>
            <a href="/" class="btn btn-outline">
                <i class="fas fa-arrow-left"></i> Volver al inicio
            </a>
        </div>
    </div>
</div>
@endsection
