import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Header() {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-gray-800 text-white shadow p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Nombre de la web */}
                <Link href="/" className="text-2xl font-bold text-neon-green">
                    MyGameList
                </Link>

                {/* Buscador */}
                <div className="flex-1 mx-6">
                    <form action={route("game.search")} method="get">
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Buscar juegos..."
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </form>
                </div>

                {/* Filtro por género */}
                <div className="ml-4">
                    <form action={route("game.searchGenre")} method="get">
                        <select
                            name="genre_id"
                            onChange={(e) => e.target.form.submit()}
                            defaultValue=""
                            className="px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="" disabled>
                                Filtrar por género
                            </option>
                            {usePage().props.genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </form>
                </div>

                {/* Enlaces a la derecha */}
                <div className="relative">
                    {!auth.user ? (
                        <div className="space-x-4">
                            <Link
                                href="/login"
                                className="hover:text-purple-400"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href="/register"
                                className="hover:text-purple-400"
                            >
                                Registrarse
                            </Link>
                        </div>
                    ) : (
                        <div className="relative inline-block text-left">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 hover:text-purple-400"
                            >
                                {auth.user.name}
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg z-50">
                                    <Link
                                        href="/user-lists"
                                        className="block px-4 py-2 hover:bg-gray-600"
                                    >
                                        Perfil
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                                    >
                                        Cerrar sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
