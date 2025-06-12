import React from "react";
import { useState } from 'react';
import { usePage, Link, useForm, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Nav from "./Partials/Nav";

export default function Lists() {
    const { auth, lists, user } = usePage().props;
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('lists.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-6xl mx-auto">

                    <Nav user={user} auth={auth} />

                    {/* Formulario para crear nueva lista (solo para el dueño del perfil) */}
                    {auth.user.id === user.id && (
                        <div className="mb-8">
                            <button
                                onClick={() => setOpen(!open)}
                                className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded font-semibold transition"
                            >
                                {open ? 'Cancelar' : '+ Crear nueva lista'}
                            </button>

                            {open && (
                                <form
                                    onSubmit={submit}
                                    className="mt-4 space-y-4 bg-gray-800 p-6 rounded-lg border border-purple-600"
                                >
                                    <h2 className="text-lg font-semibold text-purple-300">Nueva Lista</h2>

                                    <div>
                                        <label className="block text-sm text-purple-200 mb-1">Título</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full bg-gray-900 text-white rounded p-2 border border-purple-500"
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-purple-200 mb-1">Descripción</label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className="w-full bg-gray-900 text-white rounded p-2 border border-purple-500"
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-neon-green font-semibold px-4 py-2 rounded hover:bg-green-400 transition"
                                        disabled={processing}
                                    >
                                        Guardar lista
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Contenido principal */}
                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-6">Listas de {user.name}</h2>

                        {lists.data.length === 0 ? (
                            <p className="text-gray-400">Este usuario no tiene listas públicas.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {lists.data.map((list) => (
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
                        {lists.links.length > 1 && (
                            <div className="mt-8 flex justify-center">
                                <div className="flex gap-2 flex-wrap">
                                    {lists.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url)}
                                            className={`px-4 py-2 rounded border border-purple-500 text-sm ${link.active
                                                    ? "bg-neon-green text-black font-bold"
                                                    : "bg-gray-800 text-purple-300 hover:bg-purple-600"
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
