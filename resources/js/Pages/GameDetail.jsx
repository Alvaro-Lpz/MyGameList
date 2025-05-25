import React from "react";
import { usePage } from "@inertiajs/react";

export default function GameDetail() {
  const { game } = usePage().props;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{game.title}</h1>

      {game.cover_url && (
        <img
          src={game.cover_url}
          alt={`Portada de ${game.title}`}
          className="w-64 h-auto rounded-lg mb-4"
        />
      )}

      <p className="mb-2">
        {/* toFixed(1) sirve para mostrar el rating con un decimal. */}
        <strong>Rating:</strong> {game.rating ? game.rating.toFixed(1) : 'No disponible'} 
      </p>
      <p className="mb-2">
        <strong>Release Date:</strong> {game.first_release_date ?? 'Desconocida'}
      </p>
    </div>
  );
}