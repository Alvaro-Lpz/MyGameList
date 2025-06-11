import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function UserLayout({ children }) {
    const { userData } = usePage().props;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 text-white">
            {/* Perfil */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${userData.name}`}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-purple-600"
                />
                <h1 className="text-3xl font-bold text-neon-green">{userData.name}</h1>
            </div>

            {/* Navegación */}
            <nav className="mb-8 border-b border-purple-700 pb-2 flex gap-4 text-purple-300">
                <Link
                    href={route('user.profile', userData.name)}
                    className={({ isActive }) =>
                        `hover:text-neon-green ${location.pathname.endsWith(userData.name) ? 'text-neon-green font-bold' : ''}`
                    }
                >
                    Inicio
                </Link>
                <Link
                    href={route('user.lists', userData.name)}
                    className={({ isActive }) =>
                        `hover:text-neon-green ${location.pathname.includes('/listas') ? 'text-neon-green font-bold' : ''}`
                    }
                >
                    Listas
                </Link>
                <Link
                    href={route('user.reviews', userData.name)}
                    className={({ isActive }) =>
                        `hover:text-neon-green ${location.pathname.includes('/reviews') ? 'text-neon-green font-bold' : ''}`
                    }
                >
                    Reviews
                </Link>
            </nav>

            {children}
        </div>
    );
}
