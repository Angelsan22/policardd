<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Equivalente a app/security/auth.py::is_logged_in / redirect_login del
 * Servicio web1: exige una sesion de cliente (token guardado tras login
 * contra la API) antes de dejar pasar la peticion.
 */
class ClienteAutenticado
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! session('policard_token')) {
            return redirect('/login')->with('error', 'Debes iniciar sesion');
        }

        return $next($request);
    }
}
