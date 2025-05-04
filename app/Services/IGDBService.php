<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

// Clase para poder hacer llamadas a la API

class IGDBService
{
    protected $clientId;
    protected $clientSecret;

    public function __construct()
    {
        $this->clientId = config('services.igdb.client_id');
        $this->clientSecret = config('services.igdb.client_secret');
    }

    protected function getAccessToken()
    {
        return Cache::remember('igdb_token', 3600 * 24, function () {
            $response = Http::asForm()->post('https://id.twitch.tv/oauth2/token', [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'grant_type' => 'client_credentials',
            ]);

            return $response->json()['access_token'];
        });
    }

    public function query($endpoint, $query)
    {
        $token = $this->getAccessToken();

        $response = Http::withHeaders([
            'Client-ID' => $this->clientId,
            'Authorization' => 'Bearer ' . $token,
        ])->withBody($query, 'text/plain')->post("https://api.igdb.com/v4/{$endpoint}");

        return $response->json();
    }

    // Ejemplo de método específico
    public function getTopGames($limit = 10)
    {
        $query = "fields name, rating, first_release_date; sort rating desc; limit {$limit};";
        return $this->query('games', $query);
    }
}
