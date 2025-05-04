<?php

namespace App\Http\Controllers;

use App\Services\IGDBService;
use Illuminate\Http\Request;

class GamesController extends Controller
{
    public function index(IGDBService $igdb)
    {
        // Obtener los 5 mejores juegos
        $games = $igdb->getTopGames(5);

        // Pasar los juegos a la vista 'index'
        return view('index', compact('games'));
    }
}
