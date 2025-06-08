<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Genre;
use App\Services\IGDBService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GamesController extends Controller
{

    public function index()
    {
        $igdbService = new IGDBService();
        $games = $igdbService->getTopGames(10);

        $games = collect($games)->map(function ($game) {
            return [
                'id' => $game['id'],
                'title' => $game['name'] ?? 'Sin título',
                'cover_url' => isset($game['cover']['image_id'])
                    ? "https://images.igdb.com/igdb/image/upload/t_cover_big/{$game['cover']['image_id']}.jpg"
                    : null,
            ];
        });

        // Traer las listas del usuario autenticado (si hay sesión iniciada)
        $userLists = Auth::check()
            ? Auth::user()->lists()->select('id', 'title')->get()
            : collect();

        return Inertia::render('GameList', [
            'games' => $games,
            'userLists' => $userLists,
        ]);
    }

    public function gameDetail($id)
    {
        $igdbService = new IGDBService();

        $games = $igdbService->query('games', "
        fields name, summary, storyline, cover.image_id, rating, first_release_date;
        where id = {$id};
    ");

        $game = collect($games)->map(function ($game) {
            return [
                'id' => $game['id'], // Este es el igdb_id
                'igdb_id' => $game['id'], // Lo agregamos explícitamente
                'title' => $game['name'] ?? 'Sin título',
                'summary' => $game['summary'],
                'storyline' => $game['storyline'] ?? null,
                'cover_url' => isset($game['cover']['image_id'])
                    ? "https://images.igdb.com/igdb/image/upload/t_cover_big/{$game['cover']['image_id']}.jpg"
                    : null,
                'rating' => $game['rating'] ?? null,
                'first_release_date' => isset($game['first_release_date'])
                    ? \Carbon\Carbon::createFromTimestamp($game['first_release_date'])->toDateString()
                    : null,
            ];
        })->first();

        // Verifica si no se encontró ningún juego
        if (!$game) {
            abort(404, 'Juego no encontrado');
        }

        return Inertia::render('GameDetail', [
            'game' => $game,
        ]);
    }

    public function addToLists(Request $request, $igdb_id)
    {
        $request->validate([
            'lists' => 'required|array',
            'lists.*' => 'integer|exists:user_lists,id',
        ]);

        $user = Auth::user();

        // Buscar o crear el juego localmente
        $game = Game::where('igdb_id', $igdb_id)->first();

        if (!$game) {
            $igdbService = new IGDBService();

            $query = "
            fields name,cover.image_id,genres,summary,first_release_date;
            where id = {$igdb_id};
        ";
            $results = $igdbService->query('games', $query);

            if (empty($results)) {
                return redirect()->back()->withErrors(['error' => 'Juego no encontrado en IGDB.']);
            }

            $data = $results[0];

            $game = Game::create([
                'igdb_id' => $data['id'],
                'title' => $data['name'] ?? 'Sin título',
                'summary' => $data['summary'] ?? null,
                'genres' => $data['genres'] ?? null,
                'release_date' => isset($data['first_release_date'])
                    ? \Carbon\Carbon::createFromTimestamp($data['first_release_date'])->toDateString()
                    : null,
                'cover_url' => isset($data['cover']['image_id'])
                    ? "https://images.igdb.com/igdb/image/upload/t_cover_big/{$data['cover']['image_id']}.jpg"
                    : null,
            ]);

            // Asocia los generos al juego que se añade
            if (!empty($data['genres'])) {
                foreach ($data['genres'] as $genreId) {
                    $genreData = $igdbService->query('genres', "fields name; where id = {$genreId};");

                    if (!empty($genreData)) {
                        $genre = Genre::updateOrCreate(
                            ['igdb_id' => $genreData[0]['id']],
                            ['name' => $genreData[0]['name']]
                        );

                        $game->genres()->syncWithoutDetaching([$genre->id]);
                    }
                }
            }
        }

        // Asociar el juego a las listas del usuario
        foreach ($request->lists as $listId) {
            $list = $user->lists()->where('id', $listId)->first();

            if ($list) {
                $list->games()->syncWithoutDetaching([$game->id]);
            }
        }

        return redirect()->back()->with('success', 'Juego añadido a las listas seleccionadas.');
    }

    public function search(Request $request)
    {
        $input = $request->input('search');

        $a = new IGDBService();

        // Hay que usar \"{$variable}\" para que asi coja el juego completo, si no, no funciona
        // El propio search busca como LIKE en sql, por lo que con dejarlo asi ya busca resultados que contengan el input
        $search = $a->query('games', "search \"{$input}\"; fields name, cover.image_id;");

        $search = collect($search)->map(function ($s) {
            return [
                'id' => $s['id'],
                'title' => $s['name'] ?? 'Sin título',
                'cover_url' => isset($s['cover']['image_id'])
                    ? "https://images.igdb.com/igdb/image/upload/t_cover_big/{$s['cover']['image_id']}.jpg"
                    : null,
            ];
        });

        $userLists = Auth::check()
            ? Auth::user()->lists()->select('id', 'title')->get()
            : collect();

        return Inertia::render('Search', [
            'search' => $search,
            'lists' => $userLists
        ]);
    }
}
