import React from "react";
import { Link } from "@inertiajs/react";

export default function Nav({ user, auth }) {
    return (
        <>
            <div className="flex items-center space-x-6 mb-6">
                <img
                    src={
                        user.img_path
                            ? `/storage/${user.img_path}`
                            : `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.name}`
                    }
                    alt={`Avatar de ${user.name}`}
                    className="w-20 h-20 rounded-full border-4 border-purple-500"
                />

                <h1 className="text-3xl font-bold text-neon-green tracking-wide">
                    {user.name}
                </h1>
            </div>

            <nav className="flex space-x-6 border-b border-purple-700 pb-4 mb-8">
                <Link
                    href={route('user.profile', auth.user.name)}
                    className="text-purple-300 hover:text-neon-green transition"
                >
                    Inicio
                </Link>
                <Link
                    href={route("user.lists", { username: auth.user.name })}
                    className="text-purple-300 hover:text-neon-green transition"
                >
                    Listas
                </Link>
                <Link
                    href={route('user.reviews', { username: auth.user.name })}
                    className="text-purple-300 hover:text-neon-green transition"
                >
                    Reviews
                </Link>
            </nav>
        </>
    );
}
