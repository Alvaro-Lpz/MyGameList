<?php

namespace App\Http\Controllers;

use Tests\TestCase;
use App\Models\User;
use App\Models\Game;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;



class ReviewControllerTest extends TestCase
{

    public function test_store_creates_review_with_valid_data()
    {
        $user = User::factory()->create();
        $game = Game::factory()->create(['igdb_id' => 12345]);

        $response = $this->actingAs($user)->post(route('reviews.store', ['igdb_id' => $game->igdb_id]), [
            'rating' => 9,
            'review_text' => 'Awesome game!',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'game_id' => $game->id,
            'rating' => 9,
            'review_text' => 'Awesome game!',
        ]);
    }

    public function test_store_fails_with_missing_rating()
    {
        $user = User::factory()->create();
        $game = Game::factory()->create(['igdb_id' => 12345]);

        $response = $this->actingAs($user)->post(route('reviews.store', ['igdb_id' => $game->igdb_id]), [
            'review_text' => 'No rating provided',
        ]);

        $response->assertSessionHasErrors('rating');
        $this->assertDatabaseMissing('reviews', [
            'review_text' => 'No rating provided',
        ]);
    }

    public function test_store_fails_with_missing_review_text()
    {
        $user = User::factory()->create();
        $game = Game::factory()->create(['igdb_id' => 12345]);

        $response = $this->actingAs($user)->post(route('reviews.store', ['igdb_id' => $game->igdb_id]), [
            'rating' => 7,
        ]);

        $response->assertSessionHasErrors('review_text');
        $this->assertDatabaseMissing('reviews', [
            'rating' => 7,
        ]);
    }

    public function test_store_fails_with_rating_out_of_range()
    {
        $user = User::factory()->create();
        $game = Game::factory()->create(['igdb_id' => 12345]);

        $response = $this->actingAs($user)->post(route('reviews.store', ['igdb_id' => $game->igdb_id]), [
            'rating' => 15,
            'review_text' => 'Rating too high',
        ]);

        $response->assertSessionHasErrors('rating');
        $this->assertDatabaseMissing('reviews', [
            'review_text' => 'Rating too high',
        ]);
    }

    public function test_store_fails_when_game_does_not_exist()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('reviews.store', ['igdb_id' => 99999]), [
            'rating' => 8,
            'review_text' => 'Game not found',
        ]);

        $response->assertStatus(500); // Or customize if you handle this differently
        $this->assertDatabaseMissing('reviews', [
            'review_text' => 'Game not found',
        ]);
    }
}