<?php

namespace App\Http\Controllers;

use App\Services\PolicardApiClient;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(protected PolicardApiClient $api)
    {
    }

    public function loginForm()
    {
        if (session('policard_token')) {
            return redirect('/');
        }

        return view('auth.login', ['email' => '']);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $respuesta = $this->api->post('/auth/login', $data);

        if (! $respuesta->successful()) {
            return back()->withInput()->with('error', $respuesta->json('detail') ?? 'Email o contrasena incorrectos');
        }

        $body = $respuesta->json();

        if (($body['tipo'] ?? null) !== 'cliente') {
            return back()->withInput()->with('error', 'Este portal es solo para clientes. Bancos y administradores deben usar el otro sitio.');
        }

        $request->session()->put('policard_token', $body['access_token']);
        $request->session()->put('policard_tipo', $body['tipo']);
        $request->session()->put('policard_nombre', $body['nombre']);

        return redirect('/')->with('success', "Bienvenido {$body['nombre']}!");
    }

    public function registroForm()
    {
        if (session('policard_token')) {
            return redirect('/');
        }

        return view('auth.registro', [
            'nombre' => '', 'telefono' => '', 'fecha_nacimiento' => '', 'direccion' => '',
        ]);
    }

    public function registro(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|min:3',
            'email' => 'required|email',
            'password' => 'required|min:6',
            'confirm_password' => 'required|same:password',
            'telefono' => 'required',
            'fecha_nacimiento' => 'required|date',
            'direccion' => 'required',
        ]);

        $respuesta = $this->api->post('/auth/registro', [
            'nombre' => $data['nombre'],
            'email' => $data['email'],
            'password' => $data['password'],
            'telefono' => $data['telefono'],
            'fecha_nacimiento' => $data['fecha_nacimiento'],
            'direccion' => $data['direccion'],
        ]);

        if (! $respuesta->successful()) {
            return back()->withInput()->with('error', $respuesta->json('detail') ?? 'No se pudo completar el registro');
        }

        $body = $respuesta->json();
        $request->session()->put('policard_token', $body['access_token']);
        $request->session()->put('policard_tipo', $body['tipo']);
        $request->session()->put('policard_nombre', $body['nombre']);

        return redirect('/')->with('success', 'Registro exitoso! Bienvenido a PoliCard.');
    }

    public function logout(Request $request)
    {
        $request->session()->forget(['policard_token', 'policard_tipo', 'policard_nombre']);

        return redirect('/');
    }
}
