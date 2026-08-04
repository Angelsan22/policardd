@extends('layout')
@section('title', 'Catálogo de Tarjetas — PoliCard')

@section('extra_styles')
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&display=swap');
* { box-sizing: border-box; }
body { font-family: 'Outfit', sans-serif; }

.page-header { margin-bottom: 2.5rem; }
.page-header h1 { font-family: 'DM Serif Display', serif; font-size: 2.4rem; color: var(--primary); display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.4rem; }
.page-header h1 i { color: var(--secondary); }
.page-header p { color: var(--texto-medio); font-size: 1rem; }

.tarjetas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; padding-top: 2rem; }

.tarjeta-wrap { position: relative; animation: card-enter 0.5s ease both; padding-top: 45px; }
@keyframes card-enter { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

.tarjeta-card {
    position: relative; background: #ffffff; border-radius: 24px;
    display: flex; flex-direction: column;
    border: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 4px 24px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.05);
    transition: transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s;
    z-index: 2;
}
.tarjeta-card:hover { transform: translateY(-8px) scale(1.015); box-shadow: 0 20px 55px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.07); }

.tarjeta-img-wrapper { position: absolute; top: -15px; right: 16px; width: 152px; height: 100px; z-index: 10; display: flex; align-items: flex-start; justify-content: flex-end; }
.tarjeta-img { width: 148px; height: 94px; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 28px rgba(0,0,0,0.28), 0 3px 8px rgba(0,0,0,0.15); transform: perspective(500px) rotateY(-3deg) rotateX(4deg); }
.tarjeta-img-placeholder { width: 148px; height: 94px; border-radius: 12px; box-shadow: 0 10px 28px rgba(0,0,0,0.22), 0 3px 8px rgba(0,0,0,0.10); transform: perspective(500px) rotateY(-3deg) rotateX(4deg); position: relative; overflow: visible; }
.ph-inner { position: absolute; inset: 0; border-radius: 12px; overflow: hidden; }
.ph-inner .ph-chip { position: absolute; top: 20px; left: 20px; width: 32px; height: 24px; background: rgba(255,255,255,0.35); border-radius: 5px; border: 1.5px solid rgba(255,255,255,0.5); }
.ph-inner .ph-name { position: absolute; top: 50px; left: 20px; font-size: 8px; color: rgba(255,255,255,0.7); letter-spacing: 0.1em; text-transform: uppercase; }
.ph-inner .ph-dots { position: absolute; bottom: 20px; left: 20px; display: flex; gap: 4px; }
.ph-inner .ph-dots span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.6); }
.ph-inner .ph-logo { position: absolute; bottom: 16px; right: 16px; display: flex; }
.ph-inner .ph-logo span { width: 24px; height: 24px; border-radius: 50%; display: block; }
.ph-inner .ph-logo span:first-child { background: rgba(255,80,0,0.85); margin-right: -10px; }
.ph-inner .ph-logo span:last-child { background: rgba(255,180,0,0.75); }

.grad-bbva      { background: linear-gradient(135deg, #003b8e 0%, #1a6fd4 100%); }
.grad-santander { background: linear-gradient(135deg, #8b0000 0%, #cc0000 100%); }
.grad-banamex   { background: linear-gradient(135deg, #7a5800 0%, #c8952a 100%); }
.grad-hsbc      { background: linear-gradient(135deg, #8b0010 0%, #db0011 100%); }
.grad-banorte   { background: linear-gradient(135deg, #b34000 0%, #f06000 100%); }
.grad-nu        { background: linear-gradient(135deg, #3d0060 0%, #8b1db8 100%); }
.grad-default   { background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); }

.tarjeta-body { padding: 4.2rem 1.5rem 1.6rem; flex: 1; display: flex; flex-direction: column; }
.tarjeta-banco { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.15rem; }
.tarjeta-nombre { font-family: 'DM Serif Display', serif; font-size: 1.35rem; color: var(--primary); margin-bottom: 0.8rem; line-height: 1.2; }
.badge-tipo { display: inline-flex; align-items: center; gap: 5px; padding: 0.22rem 0.75rem; border-radius: 99px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 1rem; width: fit-content; }
.badge-estudiante { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
.badge-joven      { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
.badge-clasica    { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }

.tarjeta-stat { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 0.88rem; }
.tarjeta-stat:last-of-type { border-bottom: none; }
.tarjeta-stat .label { color: #6b7280; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
.tarjeta-stat .value { font-weight: 700; color: var(--primary); }
.value-free { color: #16a34a !important; }

.beneficios-box { margin-top: 1rem; background: rgba(102,194,164,0.08); border: 1px solid rgba(102,194,164,0.2); border-radius: 12px; padding: 0.85rem 1rem; font-size: 0.82rem; color: var(--primary); line-height: 1.55; display: flex; gap: 8px; align-items: flex-start; }
.beneficios-box i { color: var(--secondary); flex-shrink: 0; margin-top: 2px; font-size: 0.85rem; }
</style>
@endsection

@section('content')

<div class="page-header">
    <h1><i class="fas fa-credit-card"></i> Catálogo de Tarjetas</h1>
    <p>Compara todas las opciones disponibles para jóvenes y estudiantes</p>
</div>

<div class="tarjetas-grid">
    @forelse ($tarjetas as $tarjeta)
        @php
            $bn = strtolower($tarjeta['banco']);
            $grad = 'grad-default';
            if (str_contains($bn, 'bbva')) $grad = 'grad-bbva';
            elseif (str_contains($bn, 'santander')) $grad = 'grad-santander';
            elseif (str_contains($bn, 'banamex')) $grad = 'grad-banamex';
            elseif (str_contains($bn, 'hsbc')) $grad = 'grad-hsbc';
            elseif (str_contains($bn, 'banorte')) $grad = 'grad-banorte';
            elseif (str_contains($bn, 'nu')) $grad = 'grad-nu';
        @endphp
        <div class="tarjeta-wrap">
            <div class="tarjeta-card">
                <div class="tarjeta-body">
                    <div class="tarjeta-banco">{{ $tarjeta['banco'] }}</div>
                    <div class="tarjeta-nombre">{{ $tarjeta['nombre'] }}</div>

                    @if ($tarjeta['tipo'] === 'estudiante')
                        <span class="badge-tipo badge-estudiante"><i class="fas fa-user-graduate"></i> Estudiante</span>
                    @elseif ($tarjeta['tipo'] === 'joven')
                        <span class="badge-tipo badge-joven"><i class="fas fa-star"></i> Joven</span>
                    @else
                        <span class="badge-tipo badge-clasica"><i class="fas fa-credit-card"></i> Clásica</span>
                    @endif

                    <div class="tarjeta-stat">
                        <span class="label"><i class="fas fa-percentage"></i> CAT Anual</span>
                        <span class="value">{{ $tarjeta['cat'] }}%</span>
                    </div>
                    <div class="tarjeta-stat">
                        <span class="label"><i class="fas fa-dollar-sign"></i> Anualidad</span>
                        <span class="value {{ $tarjeta['anualidad'] == 0 ? 'value-free' : '' }}">
                            {{ $tarjeta['anualidad'] == 0 ? 'GRATIS' : '$'.intval($tarjeta['anualidad']) }}
                        </span>
                    </div>
                    <div class="tarjeta-stat">
                        <span class="label"><i class="fas fa-user-clock"></i> Edad mínima</span>
                        <span class="value">{{ $tarjeta['edad_minima'] }} años</span>
                    </div>

                    <div class="beneficios-box">
                        <i class="fas fa-gift"></i>
                        <span>{{ $tarjeta['beneficios'] }}</span>
                    </div>

                    <div style="margin-top: 1rem;">
                        @if (session('policard_token'))
                            <form method="POST" action="/tarjetas/{{ $tarjeta['id'] }}/solicitar">
                                @csrf
                                <button type="submit" class="btn btn-secondary btn-full">
                                    <i class="fas fa-paper-plane"></i> Solicitar tarjeta
                                </button>
                            </form>
                        @else
                            <a href="/registro" class="btn btn-outline btn-full">
                                <i class="fas fa-user-plus"></i> Regístrate para solicitar
                            </a>
                        @endif
                    </div>
                </div>

                <div class="tarjeta-img-wrapper">
                    @if (!empty($tarjeta['imagen_url']))
                        <img class="tarjeta-img" src="{{ $tarjeta['imagen_url'] }}" alt="{{ $tarjeta['nombre'] }}">
                    @else
                        <div class="tarjeta-img-placeholder {{ $grad }}">
                            <div class="ph-inner {{ $grad }}">
                                <div class="ph-chip"></div>
                                <div class="ph-name">{{ $tarjeta['banco'] }}</div>
                                <div class="ph-dots"><span></span><span></span><span></span><span></span></div>
                                <div class="ph-logo"><span></span><span></span></div>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    @empty
    <div style="grid-column:1/-1; text-align:center; padding:4rem; color:#5A7A6A;">
        <i class="fas fa-credit-card" style="font-size:3rem; margin-bottom:1rem; display:block; opacity:0.3;"></i>
        <p>No hay tarjetas disponibles por el momento.</p>
    </div>
    @endforelse
</div>

@endsection
