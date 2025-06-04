import React from "react";
import { usePage } from "@inertiajs/react";
import Header from "@/Components/Header";

export default function GameDetail() {
  const { game } = usePage().props;

  return (
    // Añadimos <> en vez de <div> para que no se añada ese <div> al cargar la página si no lo necesitamos
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
              <span className="text-purple-400 font-semibold">Storyline:</span>{" "}
              {/* Algunos juegos tienen su storyline vacío */}
              {game.storyline ?? game.summary}
            </p>
            <p>
              <span className="text-purple-400 font-semibold">Rating:</span>{" "}
              {/* Lo muestra solo con un decimal */}
              {game.rating ? game.rating.toFixed(1) : "No disponible"}
            </p>
            <p>
              <span className="text-purple-400 font-semibold">Release Date:</span>{" "}
              {game.first_release_date ?? "Desconocida"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
