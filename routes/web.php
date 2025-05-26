<?php

use App\Http\Controllers\GamesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserListController;
use App\Models\Game;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/index', [GamesController::class, 'index']); // Devuelve datos en JSON
Route::get('/lists', [UserListController::class, 'index']);
Route::get('/games/{id}', [GamesController::class, 'show'])->name('game.detail');

Route::get('/dashboard', [UserController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/create-list', [UserController::class, 'createList'])->name('create-list');
});

Route::get('/home', function () {
    return Inertia::render('Home', [
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);

})->middleware(['auth', 'verified'])->name('home');

require __DIR__.'/auth.php';
