<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Genre;
use App\Models\Review;
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

    public function gameDetail($igdb_id)
    {
        $igdbService = new IGDBService();

        $games = $igdbService->query('games', "
        fields name, summary, storyline, cover.image_id, rating, first_release_date;
        where id = {$igdb_id};
    ");

        $apiGame = collect($games)->map(function ($game) {
            return [
                'id' => $game['id'],
                'igdb_id' => $game['id'],
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

        if (!$apiGame) {
            abort(404, 'Juego no encontrado');
        }

        // Buscar el juego en la base de datos o crearlo
        $localGame = Game::firstOrCreate(
            ['igdb_id' => $apiGame['id']],
            ['title' => $apiGame['title']]
        );

        // Obtener las reviews relacionadas
        $reviews = Review::with(['user', 'comments.user'])
            ->where('game_id', $localGame->id)
            ->latest()
            ->get();

        return Inertia::render('GameDetail', [
            'game' => $apiGame,
            'reviews' => $reviews,
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
        $page = (int) $request->input('page', 1);
        $perPage = 20;
        $offset = ($page - 1) * $perPage;

        $searchTerm = $request->input('q');
        $genreId = $request->input('genre_id');
        $minRating = $request->input('min_rating');
        $sortBy = $request->input('sort_by');

        $filters = [];

        // Filtro por género (usamos el igdb_id, no el interno)
        if ($genreId) {
            $genre = Genre::find($genreId);
            if ($genre) {
                $filters[] = "genres = ({$genre->igdb_id})";
            }
        }

        // Filtro por rating
        if ($minRating) {
            $filters[] = "rating >= {$minRating}";
        }

        // Solo agregamos filtro por nombre si no estamos usando `search`
        $useSearch = false;
        $searchQuery = '';
        if ($searchTerm) {
            $useSearch = true;
            $searchQuery = 'search "' . addslashes($searchTerm) . '"; ';
        }

        // Construcción del filtro final
        $filterString = !empty($filters) ? 'where ' . implode(' & ', $filters) . '; ' : '';

        // Solo podemos ordenar si no hay término de búsqueda
        $sortQuery = '';
        if (!$useSearch && $sortBy) {
            switch ($sortBy) {
                case 'title_asc':
                    $sortQuery = 'sort name asc;';
                    break;
                case 'rating_desc':
                    $sortQuery = 'sort rating desc;';
                    break;
                case 'release_desc':
                    $sortQuery = 'sort first_release_date desc;';
                    break;
            }
        }

        // Consulta final a IGDB
        $igdbQuery = $searchQuery .
            $filterString .
            'fields name, summary, genres, cover.image_id, first_release_date, rating; ' .
            $sortQuery .
            "limit {$perPage}; offset {$offset};";

        $igdbResults = (new IGDBService())->query('games', $igdbQuery);

        $games = collect();

        foreach ($igdbResults as $data) {
            if (!isset($data['id'])) {
                continue;
            }

            $game = Game::updateOrCreate(
                ['igdb_id' => $data['id']],
                [
                    'title' => $data['name'] ?? 'Sin título',
                    'summary' => $data['summary'] ?? null,
                    'release_date' => isset($data['first_release_date'])
                        ? \Carbon\Carbon::createFromTimestamp($data['first_release_date'])->toDateString()
                        : null,
                    'cover_url' => isset($data['cover']['image_id'])
                        ? "https://images.igdb.com/igdb/image/upload/t_cover_big/{$data['cover']['image_id']}.jpg"
                        : null,
                    'rating' => (array_key_exists('rating', $data) && is_numeric($data['rating']))
                        ? round($data['rating'], 1)
                        : null,
                ]
            );

            if (isset($data['genres'])) {
                foreach ($data['genres'] as $igdbGenreId) {
                    $g = Genre::firstOrCreate(['igdb_id' => $igdbGenreId], ['name' => 'Pendiente']);
                    $game->genres()->syncWithoutDetaching([$g->id]);
                }
            }

            $games->push($game->load('genres'));
        }

        // Paginación manual
        $searchResults = [
            'data' => $games,
            'current_page' => $page,
            'links' => [
                [
                    'url' => $page > 1 ? route('game.search', ['page' => $page - 1] + $request->only('q', 'genre_id', 'min_rating', 'sort_by')) : null,
                    'label' => 'Anterior',
                    'active' => false,
                ],
                [
                    'url' => route('game.search', ['page' => $page + 1] + $request->only('q', 'genre_id', 'min_rating', 'sort_by')),
                    'label' => 'Siguiente',
                    'active' => false,
                ],
            ],
        ];

        return Inertia::render('Search', [
            'search' => $searchResults,
            'lists' => Auth::check()
                ? Auth::user()->lists()->select('id', 'title')->get()
                : collect(),
            'genres' => Genre::select('id', 'name')->orderBy('name')->get(),
            'filters' => [
                'q' => $searchTerm,
                'genre_id' => $genreId,
                'min_rating' => $minRating,
                'sort_by' => $sortBy,
            ],
        ]);
    }
}
