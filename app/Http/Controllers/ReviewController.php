<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{

    public function store(Request $request, $igdb_id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:10',
            'review_text' => 'required|string|max:1000',
        ]);

        $game = Game::where('igdb_id', $igdb_id)->first();
        // Buscar el juego por igdb_id en la base de datos
        $game = Game::firstOrCreate(
            ['igdb_id' => $igdb_id],
            ['title' => 'Título provisional'] // Puedes mejorar esto si quieres.
        );

        Review::create([
            'user_id' => Auth::id(),
            'game_id' => $game->id,
            'rating' => $request->rating,
            'review_text' => $request->review_text,
        ]);

        return redirect()->back()->with('success', '¡Reseña añadida con éxito!');
    }

    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            abort(403, 'No puedes editar esta reseña.');
        }

        $validated = $request->validate([
            'review_text' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:10',
        ]);

        $review->update($validated);

        return back()->with('success', 'Reseña actualizada correctamente.');
    }

    public function destroy(Review $review)
    {
        $user = Auth::user();

        if ($review->user_id !== $user->id && $user->role !== 'moderator') {
            abort(403, 'No tienes permiso para eliminar esta reseña.');
        }

        $review->delete();

        return back()->with('success', 'Reseña eliminada correctamente.');
    }
}
