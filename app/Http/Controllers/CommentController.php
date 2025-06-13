<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, $reviewId)
    {
        $request->validate([
            'comment_text' => 'required|string|max:1000',
        ]);

        Comment::create([
            'user_id' => Auth::id(),
            'review_id' => $reviewId,
            'comment_text' => $request->comment_text,
        ]);

        return redirect()->back()->with('success', '¡Comentario añadido!');
    }

    public function update(Request $request, Comment $comment)
    {
        if (Auth::id() !== $comment->user_id) {
            abort(403);
        }

        $data = $request->validate([
            'comment_text' => 'required|string',
        ]);

        $comment->update($data);

        return back()->with('success', 'Comentario actualizado.');
    }

    public function destroy(Comment $comment)
    {
        $user = Auth::user();

        if ($comment->user_id !== $user->id && $user->role !== 'moderator') {
            abort(403, 'No tienes permiso para eliminar esta reseña.');
        }

        $comment->delete();

        return back()->with('success', 'Comentario eliminado correctamente.');
    }
}
