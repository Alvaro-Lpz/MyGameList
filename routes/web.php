<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\GamesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserListController;
use App\Models\Game;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [GamesController::class, 'index']); // Devuelve datos en JSON
Route::get('/games/search', [GamesController::class, 'search'])->name('game.search');
Route::get('/games/{id}', [GamesController::class, 'gameDetail'])->name('game.detail');


Route::get('/dashboard', [UserController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('usuario')->name('user.')->group(function () {
        Route::get('{username}', [UserController::class, 'showProfile'])->name('profile');
        Route::get('{username}/listas', [UserController::class, 'showLists'])->name('lists');
        Route::get('{username}/listas/{title}', [UserListController::class, 'show'])->name('lists.show');
        Route::get('{username}/reviews', [UserController::class, 'showReviews'])->name('reviews');
    });

    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');

    // Route::get('/listas/{title}', [UserListController::class, 'show'])->name('lists.show');
    Route::delete('/listas/{userList}/juegos/{game}', [UserListController::class, 'removeGame'])->name('lists.removeGame');

    Route::post('/reviews/{reviewId}/comments', [CommentController::class, 'store'])->name('comments.store');

    // Con ::resource laravel crea todas las vistas necesarias para el crud
    Route::resource('perfil', UserListController::class);

    Route::prefix('games')->group(function () {
        Route::post('/{igdb_id}/add-to-lists', [GamesController::class, 'addToLists']);
        Route::post('/{igdb_id}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    });
});

Route::get('/home', function () {
    return Inertia::render('Home', [
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('home');

require __DIR__ . '/auth.php';
