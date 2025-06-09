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
}
