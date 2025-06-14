import React from "react";
import { usePage } from "@inertiajs/react";
import Header from "@/Components/Header";
import ReviewForm from "@/Pages/Reviews/ReviewForm";
import ReviewList from "@/Pages/Reviews/ReviewList";

export default function GameDetail() {
    const { game, reviews } = usePage().props;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-900 text-white font-mono p-6">
                <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6 border border-purple-500">
                    <h1 className="text-4xl font-extrabold text-neon-green mb-6 text-center tracking-widest">
                        {game.title}
                    </h1>

                    {game.cover_url && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={game.cover_url}
                                alt={`Portada de ${game.title}`}
                                className="w-64 h-auto rounded-lg shadow-xl border-4 border-purple-600 hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    )}

                    <div className="space-y-4 text-lg">
                        <p>
                            <span className="text-purple-400 font-semibold">
                                Storyline:
                            </span>{" "}
                            {typeof game.storyline === "string" &&
                            game.storyline.trim() !== ""
                                ? game.storyline
                                : typeof game.summary === "string" &&
                                  game.summary.trim() !== ""
                                ? game.summary
                                : "No disponible"}
                        </p>
                        <p>
                            <span className="text-purple-400 font-semibold">
                                Rating:
                            </span>{" "}
                            {game.rating
                                ? game.rating.toFixed(1)
                                : "No disponible"}
                        </p>
                        <p>
                            <span className="text-purple-400 font-semibold">
                                Release Date:
                            </span>{" "}
                            {game.first_release_date ?? "Desconocida"}
                        </p>
                    </div>

                    {/* Mostrar formulario para nueva reseña */}
                    <ReviewForm igdb_id={game.id} />

                    {/* Mostrar lista de reseñas */}
                    <ReviewList reviews={reviews} />
                </div>
            </div>
        </>
    );
}
