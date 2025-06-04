import React from "react";
import { usePage } from "@inertiajs/react";
import Header from "@/Components/Header";
import AddToList from "@/Components/AddToList";

export default function Search() {
    const { search, lists } = usePage().props;

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-neon-green mb-6 tracking-wide">Resultados</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                        {search.map((game) => (
                            <div
                                key={game.id}
                                className="relative bg-gray-800 rounded-xl border border-purple-700 p-4 shadow-md hover:shadow-lg transition"
                            >
                                <div className="absolute top-3 right-3">
                                    <AddToList gameId={game.id} lists={lists} />
                                </div>

                                {game.cover_url && (
                                    <img
                                        src={game.cover_url}
                                        alt={`Portada de ${game.name}`}
                                        className="w-full h-40 object-cover rounded-md mb-3 transition-transform duration-300 hover:scale-105"
                                    />
                                )}

                                <h3 className="text-lg font-medium text-purple-200 mb-1 truncate">
                                    {game.title}
                                </h3>

                                {/* <p className="text-sm text-gray-400 line-clamp-3">
                                    {game.summary || "Sin resumen disponible."}
                                </p> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
