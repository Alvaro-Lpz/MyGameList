import React from "react";
import { Link, usePage } from "@inertiajs/react";
import Header from "@/Components/Header";

export default function Index() {
    const { user, lists } = usePage().props;

    return (
        <>

        <Header />

        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-neon-green tracking-widest mb-8">
                    Listas de <span className="text-purple-400">{user.name}</span>
                </h1>

                {lists.length === 0 ? (
                    <p className="text-gray-400">No tienes listas aún.</p>
                ) : (
                    lists.map((list) => (
                        <div
                            key={list.id}
                            className="bg-gray-800 border border-purple-500 rounded-lg shadow-md p-6 mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
                                {list.title}
                            </h2>

                            {list.games.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                    Esta lista no tiene juegos aún.
                                </p>
                            ) : (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {list.games.map((game) => (
                                        <li
                                            key={game.id}
                                            className="bg-gray-700 p-4 rounded-xl border border-purple-700 hover:border-neon-green shadow transition hover:shadow-xl"
                                        >
                                            {game.cover_url && (
                                                <img
                                                    src={game.cover_url}
                                                    alt={`Portada de ${game.title}`}
                                                    className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 hover:scale-105"
                                                />
                                            )}
                                            <h3 className="text-lg font-medium text-purple-200">
                                                {game.title}
                                            </h3>
                                            <div className="mt-1 text-sm text-gray-400">
                                                Géneros:{" "}
                                                {game.genres.length > 0
                                                    ? game.genres.map((g) => g.name).join(", ")
                                                    : "Sin género"}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))
                )}

                {/* <div className="mt-6">
                    <Link
                        href="/"
                        className="inline-block text-sm text-purple-400 hover:text-neon-green transition underline"
                    >
                        ← Volver a Juegos
                    </Link>
                </div> */}
            </div>
        </div>
        </>
    );
}
