<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Game;
use App\Models\Genre;
use App\Models\Review;
use App\Models\User;
use App\Models\UserList;
use App\Services\IGDBService;
use Database\Factories\UserListFactory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        $igdb = new IGDBService();

        // Géneros desde IGDB
        $genres = $igdb->getGenres();
        foreach ($genres as $genre) {
            Genre::updateOrCreate(
                ['igdb_id' => $genre['id']],
                ['name' => $genre['name']]
            );
        }

        // Juegos desde IGDB
        $games = $igdb->getGames();
        foreach ($games as $gameData) {
            $game = Game::updateOrCreate(
                ['igdb_id' => $gameData['id']],
                [
                    'title' => $gameData['name'] ?? 'Sin título',
                    'summary' => $gameData['summary'] ?? null,
                    'release_date' => isset($gameData['first_release_date'])
                        ? \Carbon\Carbon::createFromTimestamp($gameData['first_release_date'])->toDateString()
                        : null,
                    'cover_url' => isset($gameData['cover']['url'])
                        ? str_replace('t_thumb', 't_cover_big', 'https:' . $gameData['cover']['url'])
                        : null,
                ]
            );

            // Asociar géneros
            if (isset($gameData['genres'])) {
                $genreIds = Genre::whereIn('igdb_id', $gameData['genres'])->pluck('id');
                $game->genres()->sync($genreIds);
            }
        }

        // Listas de juegos
        User::all()->each(function ($user) {
            $list = UserList::factory()->create(['user_id' => $user->id]);
            $games = Game::inRandomOrder()->take(5)->pluck('id');
            $list->games()->attach($games);
        });

        // Reseñas
        User::all()->each(function ($user) {
            Game::inRandomOrder()->take(3)->each(function ($game) use ($user) {
                Review::factory()->create([
                    'user_id' => $user->id,
                    'game_id' => $game->id,
                ]);
            });
        });

        // Comentarios
        Review::all()->each(function ($review) {
            User::inRandomOrder()->take(2)->each(function ($user) use ($review) {
                Comment::factory()->create([
                    'user_id' => $user->id,
                    'review_id' => $review->id,
                ]);
            });
        });
    }
}
