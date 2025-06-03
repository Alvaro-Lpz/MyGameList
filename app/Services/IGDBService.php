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

            // Si la solicitud falló, muestra el error exacto
            if (!$response->successful()) {
                logger()->error('IGDB token request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new \Exception('Error al obtener token de IGDB. Revisa los logs.');
            }

            $data = $response->json();
            if (!isset($data['access_token'])) {
                logger()->error('IGDB token response sin access_token', ['response' => $data]);
                throw new \Exception('No se pudo obtener el access_token de IGDB.');
            }

            return $data['access_token'];
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

    public function getTopGames($limit = 10)
    {
        // $query = "fields name, rating, first_release_date; sort rating desc; limit {$limit};";
        $query = "fields name, cover.image_id, rating, first_release_date; where rating > 90; limit {$limit};";
        return $this->query('games', $query);
    }

    public function getGenres()
    {
        $query = "fields id, name; limit 100;";
        return $this->query('genres', $query);
    }

    public function getGames($limit = 10)
    {
        $query = "
        fields id, name, summary, first_release_date, cover.url, genres;
        where cover != null & genres != null;
        limit {$limit};
    ";

        return $this->query('games', $query);
    }
}
