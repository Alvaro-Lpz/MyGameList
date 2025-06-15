import React from "react";
import { Link, router } from "@inertiajs/react";
import Header from "@/Components/Header";

export default function SearchResults({ users, query }) {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <h1 className="text-3xl font-bold text-neon-green mb-6">
                    Resultados para: "{query}"
                </h1>

                {users.data.length === 0 ? (
                    <p className="text-purple-300">
                        No se encontraron usuarios.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {users.data.map((user) => (
                            <Link
                                key={user.id}
                                href={route("user.profile", user.name)}
                                className="flex items-center bg-gray-800 border border-purple-600 p-4 rounded shadow hover:bg-gray-700 transition"
                            >
                                <img
                                    src={
                                        user.img_path
                                            ? `/storage/${user.img_path}`
                                            : `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.name}`
                                    }
                                    alt={`Avatar de ${user.name}`}
                                    className="w-20 h-20 rounded-full border-4 border-purple-500"
                                />
                                <div className="ml-4">
                                    <h2 className="text-xl font-bold text-purple-300">
                                        {user.name}
                                    </h2>
                                    <div className="flex space-x-4 mt-2">
                                        <div className="bg-gray-800 p-2 rounded border border-purple-600 shadow">
                                            <h3 className="text-sm text-purple-300">
                                                Listas creadas
                                            </h3>
                                            <p className="text-neon-green text-lg font-bold">
                                                {user.lists_count}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded border border-purple-600 shadow">
                                            <h3 className="text-sm text-purple-300">
                                                Reviews publicadas
                                            </h3>
                                            <p className="text-neon-green text-lg font-bold">
                                                {user.reviews_count}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Paginación */}
                <div className="mt-8 flex justify-center">
                    <div className="flex gap-2 flex-wrap">
                        {users.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                className={`px-4 py-2 rounded border border-purple-500 text-sm ${
                                    link.active
                                        ? "bg-neon-green text-black font-bold"
                                        : "bg-gray-800 text-purple-300 hover:bg-purple-600"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
                <footer className="mt-16 text-center text-sm text-gray-400 border-t border-purple-600 pt-6">
                    <p className="mb-1">MyGameList</p>
                    <p>
                        Powered by{" "}
                        <a
                            href="https://www.igdb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{ color: "#7c7cf7" }}
                        >
                            IGDB
                        </a>
                    </p>
                </footer>
            </div>
        </>
    );
}
