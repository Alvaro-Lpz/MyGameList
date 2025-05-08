<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserListController extends Controller
{
    public function index()
    {
        // Simulación de usuario si no hay login
        $user = User::with('lists.games.genres')->first();

        return Inertia::render('UserLists', [
            'user' => $user,
            'lists' => $user->lists,
        ]);
    }
}
