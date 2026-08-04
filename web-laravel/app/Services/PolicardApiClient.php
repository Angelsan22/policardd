<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

/**
 * Unico punto de acceso a datos de este servicio: todo pasa por la API de
 * PoliCard (Servicio web1 / FastAPI). Este cliente nunca toca Postgres.
 */
class PolicardApiClient
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('services.policard.url'), '/');
        $this->apiKey = config('services.policard.key');
    }

    protected function headers(): array
    {
        $headers = ['X-API-Key' => $this->apiKey];

        if ($token = session('policard_token')) {
            $headers['Authorization'] = "Bearer {$token}";
        }

        return $headers;
    }

    public function get(string $path, array $query = []): Response
    {
        return Http::withHeaders($this->headers())
            ->timeout(8)
            ->get($this->baseUrl.$path, $query);
    }

    public function post(string $path, array $data = []): Response
    {
        return Http::withHeaders($this->headers())
            ->timeout(8)
            ->post($this->baseUrl.$path, $data);
    }
}
