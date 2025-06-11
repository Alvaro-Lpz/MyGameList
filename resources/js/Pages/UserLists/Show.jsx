import React from "react";
import { usePage, Link, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Nav from "../User/Partials/Nav";

export default function Show() {
    const { list, user, auth } = usePage().props;

    const handleRemove = (gameId) => {
        if (confirm("¿Estás seguro de que quieres eliminar este juego de la lista?")) {
            router.delete(route("lists.games.remove", {
                list: list.id,
                game: gameId
            }), {
                preserveScroll: true
            });
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-6xl mx-auto">

                    <Nav user={user} auth={auth} />

                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-4">
                            {list.title}
                        </h2>
                        <p className="text-gray-300 mb-6">
                            {list.description || "Sin descripción."}
                        </p>

                        {list.games.length === 0 ? (
                            <p className="text-gray-400">Esta lista no tiene juegos.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {list.games.map((game) => (
                                    <div
                                        key={game.id}
                                        className="bg-gray-800 rounded-lg shadow border border-purple-600 p-4"
                                    >
                                        {game.cover_url && (
                                            <img
                                                src={game.cover_url}
                                                alt={game.title}
                                                className="w-full h-40 object-cover rounded mb-3"
                                            />
                                        )}
                                        <h3 className="text-lg font-semibold text-neon-green mb-1">
                                            {game.title}
                                        </h3>
                                        <p className="text-sm text-purple-300">
                                            {game.genres?.map((g) => g.name).join(", ") || "Sin géneros"}
                                        </p>
                                        {auth.user.id === list.user.id && (
                                            <button
                                                onClick={() => handleRemove(game.id)}
                                                className="text-red-400 hover:text-red-600 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>

                                ))}

                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
