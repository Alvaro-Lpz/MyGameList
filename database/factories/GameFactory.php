<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'igdb_id' => fake()->unique()->randomNumber(),
            'name' => fake()->words(3, true),
            'summary' => fake()->paragraph,
            'release_date' => fake()->date(),
            'cover_url' => fake()->imageUrl(300, 400, 'games'),
        ];
    }
}
