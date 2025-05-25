<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Services\IGDBService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GamesController extends Controller
{
    // public function index(IGDBService $igdb)
    // {
    //     // Obtener los 5 mejores juegos
    //     $games = $igdb->getTopGames(5);

    //     // Pasar los juegos a la vista 'index'
    //     return view('index', compact('games'));
    // }

    public function index()
    {
        $igdbService = new IGDBService();
        $games = $igdbService->getTopGames(10);

        // Asegúrate de transformar los datos correctamente
        $games = collect($games)->map(function ($game) {
            return [
                'id' => $game['id'],
                'title' => $game['name'] ?? 'Sin título',
                // Hacemos que la imagen tenga mas calidad con t_cover_big
                'cover_url' => isset($game['cover']['image_id'])
                    ? "https://images.igdb.com/igdb/image/upload/t_cover_big/{$game['cover']['image_id']}.jpg"
                    : null,
            ];
        });

        return Inertia::render('GameList', [
            'games' => $games,
        ]);
    }

    public function show($id)
    {
        $igdbService = new IGDBService();

        $games = $igdbService->query('games', "
        fields name, cover.image_id, rating, first_release_date;
        where id = {$id};
    ");

        $game = collect($games)->map(function ($game) {
            return [
                'id' => $game['id'],
                'title' => $game['name'] ?? 'Sin título',
                'cover_url' => isset($game['cover']['image_id'])
                    ? "https://images.igdb.com/igdb/image/upload/t_cover_big/{$game['cover']['image_id']}.jpg"
                    : null,
                'rating' => $game['rating'] ?? null,
                'first_release_date' => isset($game['first_release_date'])
                    ? \Carbon\Carbon::createFromTimestamp($game['first_release_date'])->toDateString()
                    : null,
            ];
        })->first(); // obtener directamente el primero

        // Verifica si no se encontró ningún juego
        if (!$game) {
            abort(404, 'Juego no encontrado');
        }

        return Inertia::render('GameDetail', [
            'game' => $game,
        ]);
    }
}
