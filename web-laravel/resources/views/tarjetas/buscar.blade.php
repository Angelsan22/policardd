@extends('layout')
@section('title', 'Buscar Tarjeta — PoliCard')

@section('extra_styles')
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&display=swap');
* { box-sizing: border-box; }
body { font-family: 'Outfit', sans-serif; }

.search-panel {
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(14px);
    border-radius: 22px;
    box-shadow: 0 2px 0 rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.09);
    border: 1px solid rgba(10,66,105,0.1);
    padding: 2rem;
    margin-bottom: 2.2rem;
}
.search-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2.2rem; align-items: start; }

.tarjeta-wrap { position: relative; padding-top: 36px; }
.tarjeta-card {
    position: relative; background: #ffffff; border-radius: 24px;
    display: flex; flex-direction: column;
    border: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 4px 24px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.05);
}
.tarjeta-img-wrapper { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 170px; height: 108px; z-index: 10; display: flex; align-items: flex-start; justify-content: center; }
.tarjeta-img { width: 164px; height: 104px; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 28px rgba(0,0,0,0.28), 0 3px 8px rgba(0,0,0,0.15); transform: perspective(500px) rotateY(-3deg) rotateX(4deg); }
.tarjeta-img-placeholder { width: 164px; height: 104px; border-radius: 12px; box-shadow: 0 10px 28px rgba(0,0,0,0.22), 0 3px 8px rgba(0,0,0,0.10); transform: perspective(500px) rotateY(-3deg) rotateX(4deg); position: relative; overflow: visible; }
.ph-inner { position: absolute; inset: 0; border-radius: 12px; overflow: hidden; }
.ph-inner .ph-chip { position:absolute;top:18px;left:16px;width:28px;height:20px;background:rgba(255,255,255,0.3);border-radius:4px;border:1.5px solid rgba(255,255,255,0.5); }
.ph-inner .ph-name { position:absolute;top:44px;left:16px;font-size:7px;color:rgba(255,255,255,0.7);letter-spacing:0.1em;text-transform:uppercase; }
.ph-inner .ph-dots { position:absolute;bottom:16px;left:16px;display:flex;gap:4px; }
.ph-inner .ph-dots span { width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.6); }
.ph-inner .ph-logo { position:absolute;bottom:12px;right:14px;display:flex; }
.ph-inner .ph-logo span { width:20px;height:20px;border-radius:50%;display:block; }
.ph-inner .ph-logo span:first-child { background:rgba(255,80,0,0.85);margin-right:-8px; }
.ph-inner .ph-logo span:last-child { background:rgba(255,180,0,0.75); }

.grad-bbva      { background: linear-gradient(135deg,#003b8e,#1a6fd4); }
.grad-santander { background: linear-gradient(135deg,#8b0000,#cc0000); }
.grad-banamex   { background: linear-gradient(135deg,#7a5800,#c8952a); }
.grad-hsbc      { background: linear-gradient(135deg,#8b0010,#db0011); }
.grad-banorte   { background: linear-gradient(135deg,#b34000,#f06000); }
.grad-nu        { background: linear-gradient(135deg,#3d0060,#8b1db8); }
.grad-default   { background: linear-gradient(135deg, var(--primary), var(--secondary)); }

.tarjeta-body { padding: 5rem 1.5rem 1.6rem; flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
.tarjeta-banco { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.15rem; }
.tarjeta-nombre { font-family: 'DM Serif Display', serif; font-size: 1.25rem; color: var(--primary); margin-bottom: 0.75rem; line-height: 1.2; }
.badge-tipo { display: inline-flex; align-items: center; gap: 5px; padding: 0.2rem 0.75rem; border-radius: 99px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 1rem; width: fit-content; }
.badge-estudiante { background:#dcfce7;color:#15803d;border:1px solid #bbf7d0; }
.badge-joven      { background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe; }
.badge-clasica    { background:#fef3c7;color:#b45309;border:1px solid #fde68a; }

.tarjeta-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; width: 100%; margin-bottom: 0.5rem; }
.tarjeta-stat-box { background: #f4faf4; border: 1px solid #d4e8d4; border-radius: 10px; padding: 0.55rem 0.5rem; text-align: center; }
.tarjeta-stat-box .s-label { font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--secondary); margin-bottom: 0.15rem; }
.tarjeta-stat-box .s-val { font-size: 1rem; font-weight: 700; color: var(--primary); }
.s-val-free { color: #16a34a !important; }

.beneficios-box { margin-top: 0.85rem; width: 100%; background: rgba(102,194,164,0.08); border: 1px solid rgba(102,194,164,0.2); border-radius: 12px; padding: 0.75rem 1rem; font-size: 0.8rem; color: var(--primary); line-height: 1.5; display: flex; gap: 8px; align-items: flex-start; text-align: left; }
.beneficios-box i { color:var(--secondary);flex-shrink:0;margin-top:2px;font-size:0.82rem; }

.no-results, .empty-state { grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #5A7A6A; }
.no-results i, .empty-state i { font-size: 3rem; opacity: 0.35; display: block; margin-bottom: 1rem; }
</style>
@endsection

@section('content')
<div style="margin-bottom: 2rem;">
    <h1 class="section-title">
        <i class="fas fa-search" style="color:var(--verde-salvia);margin-right:0.5rem;"></i>
        Busca tu Tarjeta Ideal
    </h1>
    <p class="section-subtitle">Usa los filtros para encontrar la tarjeta que mejor se adapta a ti</p>
</div>

<div class="search-panel">
    <form method="GET" action="/buscar">
        <div class="search-grid">
            <div class="form-group">
                <label>Tipo de tarjeta</label>
                <select name="tipo" class="form-control">
                    <option value="">Cualquier tipo</option>
                    <option value="estudiante" {{ $tipo == 'estudiante' ? 'selected' : '' }}>Estudiante</option>
                    <option value="joven"      {{ $tipo == 'joven' ? 'selected' : '' }}>Joven</option>
                    <option value="clasica"    {{ $tipo == 'clasica' ? 'selected' : '' }}>Clásica</option>
                </select>
            </div>
            <div class="form-group">
                <label>CAT máximo (%)</label>
                <input type="number" name="cat_max" class="form-control" placeholder="Ej. 50" value="{{ $cat_max }}" min="0" max="200" step="0.5">
            </div>
            <div class="form-group">
                <label>Anualidad máxima ($)</label>
                <input type="number" name="anualidad_max" class="form-control" placeholder="Ej. 500" value="{{ $anualidad_max }}" min="0">
            </div>
            <div class="form-group">
                <label>Tu edad</label>
                <input type="number" name="edad" class="form-control" placeholder="Ej. 20" value="{{ $edad }}" min="18" max="99">
            </div>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
            <button type="submit" class="btn btn-primary btn-lg"><i class="fas fa-search"></i> Buscar tarjetas</button>
            <a href="/buscar" class="btn btn-light btn-lg"><i class="fas fa-undo"></i> Limpiar</a>
        </div>
    </form>
</div>

@if (!is_null($tarjetas))
    @if (count($tarjetas))
    <div style="margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
        <p style="color:var(--verde-medio);font-size:0.9rem;">
            <i class="fas fa-check-circle" style="color:var(--verde-salvia);"></i>
            Se encontraron <strong>{{ count($tarjetas) }}</strong> tarjeta(s) para tu búsqueda
        </p>
    </div>

    <div class="results-grid">
        @foreach ($tarjetas as $tarjeta)
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

                        <div class="tarjeta-stats-row">
                            <div class="tarjeta-stat-box">
                                <div class="s-label">CAT</div>
                                <div class="s-val">{{ $tarjeta['cat'] }}%</div>
                            </div>
                            <div class="tarjeta-stat-box">
                                <div class="s-label">Anualidad</div>
                                <div class="s-val {{ $tarjeta['anualidad'] == 0 ? 's-val-free' : '' }}">
                                    {{ $tarjeta['anualidad'] == 0 ? '$0' : '$'.intval($tarjeta['anualidad']) }}
                                </div>
                            </div>
                            <div class="tarjeta-stat-box">
                                <div class="s-label">Edad mín.</div>
                                <div class="s-val">{{ $tarjeta['edad_minima'] }}</div>
                            </div>
                        </div>

                        <div class="beneficios-box">
                            <i class="fas fa-gift"></i>
                            <span>{{ $tarjeta['beneficios'] }}</span>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
    @else
    <div class="results-grid">
        <div class="no-results">
            <i class="fas fa-search-minus"></i>
            <h3 style="font-family:'DM Serif Display',serif;color:var(--verde-oscuro);margin-bottom:0.5rem;">Sin resultados</h3>
            <p>No encontramos tarjetas con esos filtros. Prueba cambiando los parámetros.</p>
            <a href="/buscar" class="btn btn-outline mt-2">Ver todas las tarjetas</a>
        </div>
    </div>
    @endif
@else
<div style="background:#fff;border-radius:22px;padding:3rem;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <i class="fas fa-hand-pointer" style="font-size:2.5rem;color:var(--verde-salvia);margin-bottom:1rem;display:block;"></i>
    <h3 style="font-family:'DM Serif Display',serif;color:var(--primary);margin-bottom:0.5rem;">Completa el formulario</h3>
    <p style="color:var(--texto-medio);">Usa los filtros de arriba para encontrar las tarjetas que mejor se adaptan a ti.</p>
</div>
@endif

@endsection
