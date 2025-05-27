import React from "react";
import { usePage } from "@inertiajs/react";
import { route } from 'ziggy-js';
import { Ziggy } from '@/ziggy';
import { Link } from '@inertiajs/react';

export default function GameList() {
    // Aquí se extrae la propiedad games que viene desde el backend
    const { games } = usePage().props;

    return (
        // Aqui va lo que seria el contenido de la vista
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Lista de Juegos</h1>
            <ul className="space-y-2">
                {games.map((game) => (
                    <li key={game.id} className="border p-2 rounded">
                        {game.cover_url && (
                            <img
                                src={game.cover_url}
                                alt={`Portada de ${game.title}`}
                                className="w-32 h-32 object-cover mb-2"
                            />
                        )}
                        <Link href={route("game.detail", game.id)} className="text-blue-600 hover:underline">
                            {game.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link href={route('user-lists.index')}>Ver mis listas</Link>
        </div>
    );
}
