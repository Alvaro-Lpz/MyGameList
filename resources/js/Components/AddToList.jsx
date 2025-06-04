import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { router } from "@inertiajs/react"; // helper de Ziggy para generar URLs de rutas Laravel


export default function AddToList({ gameId, lists }) {
    const [open, setOpen] = useState(false);
    const [selectedLists, setSelectedLists] = useState([]);
    const { post, processing } = useForm();

    const toggleList = (listId) => {
        setSelectedLists((prev) =>
            prev.includes(listId)
                ? prev.filter((id) => id !== listId)
                : [...prev, listId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(`/games/${gameId}/add-to-lists`, {
            lists: selectedLists,
        });

        // Cierra el desplegable despues de enviar
        setOpen(false);
    };

    return (
        <div className="relative text-right">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="text-sm bg-gray-900 text-white border border-purple-500 hover:text-neon-green rounded px-3 py-1 transition"
            >
                Añadir a listas
            </button>

            {open && (
                <form
                    onSubmit={handleSubmit}
                    className="absolute right-0 mt-2 w-64 bg-gray-800 border border-purple-500 rounded-lg shadow-xl z-10 p-4"
                >
                    <fieldset className="text-left">
                        <legend className="text-purple-300 font-semibold mb-2 text-sm">
                            Selecciona tus listas
                        </legend>

                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {lists.length > 0 ? (
                                lists.map((list) => (
                                    <label key={list.id} className="flex items-center gap-2 text-gray-300 text-sm">
                                        <input
                                            type="checkbox"
                                            value={list.id}
                                            checked={selectedLists.includes(list.id)}
                                            onChange={() => toggleList(list.id)}
                                            className="accent-purple-500"
                                        />
                                        {list.title}
                                    </label>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No tienes listas creadas.</p>
                            )}
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        disabled={processing || selectedLists.length === 0}
                        className="mt-3 bg-purple-700 hover:bg-neon-green text-white font-medium py-1 px-3 rounded text-sm transition disabled:opacity-50"
                    >
                        Añadir
                    </button>
                </form>
            )}
        </div>
    );
}
