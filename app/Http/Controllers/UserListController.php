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

    public function destroy($id)
    {
        $list = UserList::findOrFail($id);

        // Verifica que el usuario autenticado sea el dueño de la lista
        if ($list->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para eliminar esta lista.');
        }

        $list->delete();

        return back()->with('success', 'Lista eliminada correctamente.');
    }

    public function removeGame(Request $request, $listId, $gameId)
    {
        $list = UserList::findOrFail($listId);

        // Verifica que el usuario autenticado sea el dueño de la lista
        if ($list->user_id !== Auth::id()) {
            abort(403, 'No tienes permiso para modificar esta lista.');
        }

        // Elimina la relación sin borrar el juego de la base de datos
        $list->games()->detach($gameId);

        return back()->with('success', 'Juego eliminado de la lista.');
    }
}
