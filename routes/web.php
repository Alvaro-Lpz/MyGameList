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


// Rutas que cualquier usuario puede ver
Route::get('/', [GamesController::class, 'index']); // Devuelve datos en JSON
Route::get('/games/search', [GamesController::class, 'search'])->name('game.search');
Route::get('/games/{id}', [GamesController::class, 'gameDetail'])->name('game.detail');

// Rutas solo para usuarios autenticados
Route::middleware('auth')->group(function () {

    // Rutas para la configuracion de los usuarios
    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rutas para el perfil del usuario
    Route::prefix('usuario')->name('user.')->group(function () {
        Route::get('{username}', [UserController::class, 'showProfile'])->name('profile');
        Route::get('{username}/listas', [UserController::class, 'showLists'])->name('lists');
        Route::get('{username}/listas/{title}', [UserListController::class, 'show'])->name('lists.show');
        Route::get('{username}/reviews', [UserController::class, 'showReviews'])->name('reviews');
    });

    // Cambiar la imagen de perfil
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');

    // Modificar las listas del usuario
    Route::prefix('listas')->name('lists.')->group(function () {
        Route::delete('deleteList/{list}', [UserListController::class, 'destroy'])->name('destroy');
        Route::delete('{list}/juegos/{game}', [UserListController::class, 'removeGame'])->name('games.remove');
    });

    // Guardar el comentario de una review
    Route::post('/reviews/{reviewId}/comments', [CommentController::class, 'store'])->name('comments.store');

    // Rutas para las acciones que se pueden hacer con los juegos
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
