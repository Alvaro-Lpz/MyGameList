<?php

namespace App\Providers;

use App\Models\Genre;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        // Compartir generos de juegos en todas las vistas
        Inertia::share('genres', function () {
            return Genre::select('id', 'name')->orderBy('name')->get();
        });
    }
}
