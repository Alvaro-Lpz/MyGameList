import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Header() {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-gray-800 text-white shadow p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo + Enlace Explorar */}
                <div className="flex items-center space-x-6">
                    <Link href="/" className="text-2xl font-bold text-neon-green">
                        MyGameList
                    </Link>
                    <Link
                        href={route("game.search")}
                        className="text-purple-300 hover:text-neon-green font-semibold transition"
                    >
                        Explorar
                    </Link>
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
                                        href={route("user.profile", auth.user.name)}
                                        className="block px-4 py-2 hover:bg-gray-600"
                                    >
                                        Perfil
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="block px-4 py-2 hover:bg-gray-600"
                                    >
                                        Configuración
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
