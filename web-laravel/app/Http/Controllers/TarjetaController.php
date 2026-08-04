<?php

namespace App\Http\Controllers;

use App\Services\PolicardApiClient;
use Illuminate\Http\Request;

class TarjetaController extends Controller
{
    public function __construct(protected PolicardApiClient $api)
    {
    }

    public function index()
    {
        $respuesta = $this->api->get('/tarjetas');
        $tarjetas = $respuesta->successful() ? $respuesta->json() : [];

        return view('tarjetas.index', compact('tarjetas'));
    }

    public function buscar(Request $request)
    {
        $filtros = [
            'tipo' => $request->query('tipo', ''),
            'cat_max' => $request->query('cat_max', ''),
            'anualidad_max' => $request->query('anualidad_max', ''),
            'edad' => $request->query('edad', ''),
        ];

        $hayFiltros = collect($filtros)->filter(fn ($v) => $v !== '' && $v !== null)->isNotEmpty();

        if (! $hayFiltros) {
            return view('tarjetas.buscar', array_merge($filtros, ['tarjetas' => null]));
        }

        $respuesta = $this->api->get('/tarjetas');
        $todas = $respuesta->successful() ? $respuesta->json() : [];

        $resultado = collect($todas)->filter(function ($t) use ($filtros) {
            if ($filtros['tipo'] !== '' && $t['tipo'] !== $filtros['tipo']) {
                return false;
            }
            if ($filtros['cat_max'] !== '' && $t['cat'] > (float) $filtros['cat_max']) {
                return false;
            }
            if ($filtros['anualidad_max'] !== '' && $t['anualidad'] > (float) $filtros['anualidad_max']) {
                return false;
            }
            if ($filtros['edad'] !== '' && $t['edad_minima'] > (int) $filtros['edad']) {
                return false;
            }

            return true;
        })->sortBy('cat')->values()->all();

        return view('tarjetas.buscar', array_merge($filtros, ['tarjetas' => $resultado]));
    }

    public function solicitar(int $id)
    {
        $respuesta = $this->api->post("/cliente/tarjeta/{$id}/solicitar");

        if ($respuesta->successful()) {
            return back()->with('success', 'Solicitud enviada! El banco revisara tu solicitud.');
        }

        return back()->with('error', $respuesta->json('detail') ?? 'No se pudo enviar la solicitud');
    }
}
