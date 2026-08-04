<?php

namespace App\Http\Controllers;

use App\Services\PolicardApiClient;

class HomeController extends Controller
{
    public function __construct(protected PolicardApiClient $api)
    {
    }

    public function index()
    {
        $misSolicitudes = [];
        $misAprobadas = [];

        if (session('policard_token')) {
            $respuesta = $this->api->get('/cliente/solicitudes');
            if ($respuesta->successful()) {
                $misSolicitudes = $respuesta->json();
                $misAprobadas = array_values(array_filter(
                    $misSolicitudes,
                    fn ($s) => $s['estado'] === 'aprobada'
                ));
            }
        }

        return view('home', compact('misSolicitudes', 'misAprobadas'));
    }
}
