<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\TarjetaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);

Route::get('/tarjetas', [TarjetaController::class, 'index']);
Route::get('/buscar', [TarjetaController::class, 'buscar']);
Route::post('/tarjetas/{id}/solicitar', [TarjetaController::class, 'solicitar'])
    ->middleware('cliente');

Route::view('/educacion', 'educacion');
Route::view('/calculadora', 'calculadora');

Route::get('/login', [AuthController::class, 'loginForm']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/registro', [AuthController::class, 'registroForm']);
Route::post('/registro', [AuthController::class, 'registro']);
Route::get('/logout', [AuthController::class, 'logout']);

Route::get('/perfil', [PerfilController::class, 'index'])->middleware('cliente');
