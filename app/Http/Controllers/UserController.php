<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        $users = User::withCount(['lists', 'reviews'])
            ->where('name', 'like', '%' . $query . '%')
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('SearchResults', [
            'users' => $users,
            'query' => $query,
        ]);
    }

    public function showProfile($username)
    {
        $user = User::where('name', $username)->firstOrFail();
        $listsCount = $user->lists()->count();
        $reviewsCount = $user->reviews()->count();
        $recentReviews = $user->reviews()
            ->with('game', 'user')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User/Profile', [
            'user' => $user,
            'listsCount' => $listsCount,
            'reviewsCount' => $reviewsCount,
            'recentReviews' => $recentReviews,
        ]);
    }

    public function showLists($username)
    {
        $user = User::where('name', $username)->firstOrFail();
        $lists = $user->lists()->with('games')->paginate(10);

        return Inertia::render('User/Lists', [
            'user' => $user,
            'lists' => $lists,
        ]);
    }

    public function showReviews($username)
    {
        $user = User::where('name', $username)->firstOrFail();

        $reviews = Review::with('game', 'user')
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User/Reviews', [
            'user' => $user,
            'reviews' => $reviews,
        ]);
    }
}
