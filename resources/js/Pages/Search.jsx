import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import AddToList from "@/Components/AddToList";

export default function Search() {

    const { search, genres, lists, filters } = usePage().props;
    const [q, setQ] = useState(filters.q || "");
    const [genreId, setGenreId] = useState(filters.genre_id || "");
    const [minRating, setMinRating] = useState(filters.min_rating || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "");

    // ⬇ Auto scroll al cambiar de página
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [search.current_page]);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route("game.search"), {
            q,
            genre_id: genreId,
            min_rating: minRating,
            sort_by: sortBy,
        });
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-neon-green mb-6 tracking-wide">
                        Resultados
                    </h1>

                    <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Buscar juego..."
                            className="p-2 rounded bg-gray-700 text-white border border-purple-500"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <select
                            value={genreId}
                            onChange={(e) => setGenreId(e.target.value)}
                            className="p-2 rounded bg-gray-700 text-white border border-purple-500"
                        >
                            <option value="">Todos los géneros</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            placeholder="Rating mínimo"
                            className="p-2 rounded bg-gray-700 text-white border border-purple-500"
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="p-2 rounded bg-gray-700 text-white border border-purple-500"
                        >
                            <option value="">Ordenar por</option>
                            <option value="title_asc">Título A-Z</option>
                            <option value="rating_desc">Rating alto</option>
                            <option value="release_desc">Más reciente</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-neon-green text-black font-bold py-2 px-4 rounded hover:bg-green-400 transition col-span-full"
                        >
                            Buscar
                        </button>
                    </form>

                    {search?.data && search.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                            {search.data.map((game) => (
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
                                            alt={`Portada de ${game.title}`}
                                            className="w-full h-40 object-cover rounded-md mb-3 transition-transform duration-300 hover:scale-105"
                                        />
                                    )}
                                    <h3 className="text-lg font-medium text-purple-200 mb-1 truncate">
                                        {game.title}
                                    </h3>
                                    <div className="text-sm text-gray-400">
                                        {game.genres.length > 0
                                            ? game.genres.map((g) => g.name).join(", ")
                                            : "Sin género"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 mt-6">No se encontraron resultados.</p>
                    )}

                    {/* Paginación: fuera del grid */}
                    {search?.links?.length > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2 flex-wrap">
                                {search.links.map((link, i) => (
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
                </div>
            </div>
        </>
    );
}
