<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        $lists = $user->lists()->with('games')->get();
        return Inertia::render('Dashboard', ['user' => $user, 'lists' => $lists]);
    }

    // public function createList()
    // {
    //     return Inertia::render('CreateList');
    // }
}
