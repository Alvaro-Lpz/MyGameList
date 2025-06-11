<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use App\Models\UserList;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserListController extends Controller
{
    use AuthorizesRequests;

    public function show($username, $title)
    {
        $user = User::where('name', $username)->firstOrFail();
        $list = UserList::where('user_id', $user->id)
            ->where('title', $title)
            ->with('games.genres', 'user')
            ->firstOrFail();

        // $this->authorize('view', $list);

        return Inertia::render('UserLists/Show', [
            'list' => $list,
            'user' => $user,
        ]);
    }

    public function removeGame(Request $request, UserList $userList, Game $game)
    {
        $this->authorize('update', $userList); // Asegura que el usuario es el dueño
        $userList->games()->detach($game->id);

        return back()->with('success', 'Juego eliminado de la lista.');
    }
}
