import React, { useState } from "react";
import { usePage, Link, router, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Nav from "../User/Partials/Nav";

export default function Show() {
    const { list, user, auth } = usePage().props;

    const [editing, setEditing] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        title: list.title,
        description: list.description || "",
    });

    const handleUpdate = (e) => {
        e.preventDefault();

        patch(route("lists.update", list.id), {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const handleRemove = (gameId) => {
        if (
            confirm(
                "¿Estás seguro de que quieres eliminar este juego de la lista?"
            )
        ) {
            router.delete(
                route("lists.games.remove", {
                    list: list.id,
                    game: gameId,
                }),
                {
                    preserveScroll: true,
                }
            );
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-6xl mx-auto">
                    <Nav user={user} auth={auth} />

                    <section className="mb-10">
                        {auth.user.id === list.user.id && !editing ? (
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-purple-300 mb-1">
                                        {list.title}
                                    </h2>
                                    <p className="text-gray-300 mb-2">
                                        {list.description || "Sin descripción."}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="text-sm text-purple-300 hover:text-neon-green"
                                >
                                    Editar
                                </button>
                            </div>
                        ) : auth.user.id === list.user.id && editing ? (
                            <form
                                onSubmit={handleUpdate}
                                className="space-y-4 mb-6"
                            >
                                <div>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="w-full bg-gray-800 text-white p-2 rounded border border-purple-500"
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full bg-gray-800 text-white p-2 rounded border border-purple-500"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-neon-green px-4 py-2 rounded font-semibold hover:bg-green-300 transition-colors duration-200"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(false);
                                            setData("title", list.title);
                                            setData(
                                                "description",
                                                list.description || ""
                                            );
                                        }}
                                        className="text-purple-300 hover:text-white bg-transparent hover:bg-red-600 px-4 py-2 rounded transition-colors duration-200"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-purple-300 mb-1">
                                    {list.title}
                                </h2>
                                <p className="text-gray-300 mb-6">
                                    {list.description || "Sin descripción."}
                                </p>
                            </>
                        )}
                    </section>

                    <section>
                        {list.games.length === 0 ? (
                            <p className="text-gray-400">
                                Esta lista no tiene juegos.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {list.games.map((game) => (
                                    <div
                                        key={game.id}
                                        className="bg-gray-800 rounded-lg shadow border border-purple-600 p-4"
                                    >
                                        <Link
                                            href={route("game.detail", game.igdb_id)}
                                            className="block"
                                        >
                                            {game.cover_url && (
                                                <img
                                                    src={game.cover_url}
                                                    alt={`Portada de ${game.title}`}
                                                    className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300 rounded mb-3"
                                                />
                                            )}
                                        </Link>

                                        <h3 className="text-lg font-semibold text-neon-green mb-1">
                                            {game.title}
                                        </h3>

                                        <p className="text-sm text-purple-300">
                                            {game.genres
                                                ?.map((g) => g.name)
                                                .join(", ") || "Sin géneros"}
                                        </p>
                                        {auth.user.id === list.user.id && (
                                            <button
                                                onClick={() =>
                                                    handleRemove(game.id)
                                                }
                                                className="text-red-400 hover:text-red-600 text-sm mt-2"
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
