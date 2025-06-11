import React from "react";
import { usePage, Link } from "@inertiajs/react";
import Header from "@/Components/Header";

export default function Show() {
    const { list, user, auth } = usePage().props;

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Avatar + nombre */}
                    <div className="flex items-center space-x-6 mb-6">
                        <img
                            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user.name}`}
                            alt={`Avatar de ${user.name}`}
                            className="w-20 h-20 rounded-full border-4 border-purple-500"
                        />
                        <h1 className="text-3xl font-bold text-neon-green tracking-wide">
                            {user.name}
                        </h1>
                    </div>

                    {/* Navegación */}
                    <nav className="flex space-x-6 border-b border-purple-700 pb-4 mb-8">
                        <Link
                            href={route("user.profile", auth.user.name)}
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
                            href={route("user.reviews", { username: auth.user.name })}
                            className="text-purple-300 hover:text-neon-green transition"
                        >
                            Reseñas
                        </Link>
                    </nav>

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
                                        <button
                                            onClick={() =>
                                                router.delete(route("lists.removeGame", { userList: list.id, game: game.id }))
                                            }
                                            className="mt-2 text-sm text-red-500 hover:text-red-700"
                                        >
                                            Eliminar de la lista
                                        </button>
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
