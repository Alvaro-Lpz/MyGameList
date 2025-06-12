<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function updateAvatar(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        if ($user->img_path) {
            Storage::disk('public')->delete($user->img_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->img_path = $path;
        $user->save();

        return redirect()->back()->with('success', 'Imagen de perfil actualizada.');
    }

    public function updateBio(Request $request, $username)
    {
        $user = User::where('name', $username)->firstOrFail();

        if ($user->id !== Auth::id()) {
            abort(403, 'No tienes permiso para modificar esta biografía.');
        }

        $validated = $request->validate([
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $user->bio = $validated['bio'];
        $user->save();

        return back()->with('success', 'Biografía actualizada.');
    }
}
