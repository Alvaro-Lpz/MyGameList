import React from 'react';
import { usePage } from '@inertiajs/react';

export default function GameList() {
    const { games } = usePage().props;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Lista de Juegos</h1>
            <ul className="space-y-2">
                {games.map((game) => (
                    <li key={game.id} className="border p-2 rounded">
                        {game.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}