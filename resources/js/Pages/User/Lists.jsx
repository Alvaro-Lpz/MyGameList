import React from "react";
import { usePage, Link, useForm, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Nav from "./Partials/Nav";

export default function Lists() {
    const { auth, lists, user } = usePage().props;

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-6xl mx-auto">

                    <Nav user={user} auth={auth} />

                    {/* Contenido principal */}
                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-6">Listas de {user.name}</h2>

                        {lists.length === 0 ? (
                            <p className="text-gray-400">Este usuario no tiene listas públicas.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {lists.map((list) => (
                                    <div
                                        key={list.id}
                                        className="bg-gray-800 border border-purple-600 rounded-xl p-4 shadow hover:shadow-lg transition relative"
                                    >
                                        <h3 className="text-xl font-semibold text-neon-green mb-2 truncate">{list.title}</h3>
                                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                            {list.description || "Sin descripción."}
                                        </p>

                                        <div className="grid grid-cols-5 gap-2 mb-4">
                                            {list.games.slice(0, 5).map((game) => (
                                                <img
                                                    key={game.id}
                                                    src={game.cover_url}
                                                    alt={game.title}
                                                    className="w-full h-24 object-cover rounded"
                                                />
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <Link
                                                href={route("user.lists.show", { username: auth.user.name, title: list.title })}
                                                className="text-sm text-purple-300 hover:text-neon-green"
                                            >
                                                Ver lista completa →
                                            </Link>

                                            {auth.user.id === list.user_id && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm("¿Seguro que deseas eliminar esta lista?")) {
                                                            router.delete(route("lists.destroy", list.id));
                                                        }
                                                    }}
                                                    className="text-sm text-red-400 hover:text-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
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
