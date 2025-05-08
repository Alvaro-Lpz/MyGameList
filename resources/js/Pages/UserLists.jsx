import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function UserLists() {
    const { user, lists } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Listas de{" "}
                    <span className="text-indigo-600">{user.name}</span>
                </h1>

                {lists.length === 0 ? (
                    <p className="text-gray-600">No tienes listas aún.</p>
                ) : (
                    lists.map((list) => (
                        <div
                            key={list.id}
                            className="mb-8 border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50"
                        >
                            <h2 className="text-xl font-semibold text-gray-700 mb-3">
                                {list.title}
                            </h2>

                            {list.games.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    Esta lista no tiene juegos aún.
                                </p>
                            ) : (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {list.games.map((game) => (
                                        <li
                                            key={game.id}
                                            className="bg-white p-4 rounded-xl border shadow transition hover:shadow-lg flex flex-col items-start"
                                        >
                                            {game.cover_url && (
                                                <img
                                                    src={game.cover_url}
                                                    alt={`Portada de ${game.title}`}
                                                    className="w-full h-48 object-cover rounded-md mb-3"
                                                />
                                            )}
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {game.title}
                                            </h3>
                                            <div className="mt-1 text-sm text-gray-500">
                                                Géneros:{" "}
                                                {game.genres.length > 0
                                                    ? game.genres
                                                          .map((g) => g.name)
                                                          .join(", ")
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
                        className="inline-block text-sm text-indigo-600 hover:text-indigo-800 transition underline"
                    >
                        ← Volver a Juegos
                    </Link>
                </div> */}
            </div>
        </div>
    );
}
