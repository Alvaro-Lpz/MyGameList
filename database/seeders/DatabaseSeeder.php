<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Game;
use App\Models\Genre;
use App\Models\Review;
use App\Models\User;
use App\Models\UserList;
use App\Services\IGDBService;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear 10 usuarios
        User::factory(10)->create();

        $igdb = new IGDBService();

        // Insertar géneros
        $genres = $igdb->getGenres();
        foreach ($genres as $genre) {
            Genre::updateOrCreate(
                ['igdb_id' => $genre['id']],
                ['name' => $genre['name']]
            );
        }

        // Insertar juegos
        $games = $igdb->getGames();
        foreach ($games as $gameData) {
            $game = Game::updateOrCreate(
                ['igdb_id' => $gameData['id']],
                [
                    'title' => $gameData['name'] ?? 'Sin título',
                    'rating' => $gameData['rating'] ?? null,
                    'summary' => $gameData['summary'] ?? null,
                    'storyline' => $gameData['storyline'] ?? null,
                    'release_date' => isset($gameData['first_release_date'])
                        ? \Carbon\Carbon::createFromTimestamp($gameData['first_release_date'])->toDateString()
                        : null,
                    'cover_url' => isset($gameData['cover']['url'])
                        ? str_replace('t_thumb', 't_cover_big', 'https:' . $gameData['cover']['url'])
                        : null,
                ]
            );

            if (isset($gameData['genres'])) {
                $uniqueGenreIgdbIds = collect($gameData['genres'])->unique()->values();
                $genreIds = Genre::whereIn('igdb_id', $uniqueGenreIgdbIds)->pluck('id')->unique()->values();
                $game->genres()->sync($genreIds);
            }
        }

        $allGames = Game::all();

        User::all()->each(function ($user) use ($allGames) {
            // Validar cantidad de juegos suficientes
            $gameCount = $allGames->count();
            $listGamesCount = min(5, $gameCount);
            $reviewGamesCount = min(10, $gameCount);

            // Crear 10 listas por usuario, cada lista con 5 juegos aleatorios
            UserList::factory(10)->create(['user_id' => $user->id])->each(function ($list) use ($allGames, $listGamesCount) {
                $list->games()->attach($allGames->random($listGamesCount)->pluck('id'));
            });

            // Crear 10 reviews por usuario, para juegos diferentes (aleatorios)
            $randomGamesForReviews = $allGames->random($reviewGamesCount);
            $randomGamesForReviews->each(function ($game) use ($user) {
                Review::factory()->create([
                    'user_id' => $user->id,
                    'game_id' => $game->id,
                ]);
            });

            // Crear 10 comentarios por usuario en reviews aleatorias (pueden no ser suyas)
            // Para evitar que un usuario comente su propia review, filtramos
            $reviewsToComment = Review::where('user_id', '!=', $user->id)->inRandomOrder()->take(10)->get();

            foreach ($reviewsToComment as $review) {
                Comment::factory()->create([
                    'user_id' => $user->id,
                    'review_id' => $review->id,
                ]);
            }
        });
    }
}
