<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserList;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserListController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();
        $lists = $user->lists()->with('games.genres')->get();
        return Inertia::render('UserLists/Index', ['user' => $user, 'lists' => $lists]);

    }

        public function create()
    {
        return Inertia::render('UserLists/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Auth::user()->lists()->create($data);

        return redirect()->route('user-lists.index')->with('success', 'Lista creada correctamente.');
    }

    public function edit(UserList $userList)
    {
        $this->authorize('update', $userList);

        return Inertia::render('UserLists/Edit', [
            'list' => $userList
        ]);
    }

    public function update(Request $request, UserList $userList)
    {
        $this->authorize('update', $userList);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $userList->update($data);

        return redirect()->route('user-lists.index')->with('success', 'Lista actualizada.');
    }

    public function destroy(UserList $userList)
    {
        $this->authorize('delete', $userList);
        $userList->delete();

        return redirect()->route('user-lists.index')->with('success', 'Lista eliminada.');
    }
}
