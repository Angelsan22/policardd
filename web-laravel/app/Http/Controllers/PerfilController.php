<?php

namespace App\Http\Controllers;

use App\Services\PolicardApiClient;

class PerfilController extends Controller
{
    public function __construct(protected PolicardApiClient $api)
    {
    }

    public function index()
    {
        $respuesta = $this->api->get('/cliente/me');
        $usuario = $respuesta->successful() ? $respuesta->json() : null;

        return view('perfil', compact('usuario'));
    }
}
