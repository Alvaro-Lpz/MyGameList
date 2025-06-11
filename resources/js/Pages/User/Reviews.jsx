import React from "react";
import { usePage, Link, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Nav from "./Partials/Nav";

export default function Reviews() {
    const { user, auth, reviews } = usePage().props;

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Avatar + nombre */}

                    <Nav user={user} auth={auth} />

                    {/* Contenido principal */}
                    <section>
                        <h2 className="text-2xl font-bold text-purple-300 mb-6">
                            Reseñas de {user.name}
                        </h2>

                        {reviews.length === 0 ? (
                            <p className="text-gray-400">Este usuario aún no ha escrito ninguna reseña.</p>
                        ) : (
                            <div className="space-y-6">
                                {reviews.data.length === 0 ? (
                                    <p className="text-gray-400">Este usuario aún no ha escrito ninguna reseña.</p>
                                ) : (
                                    <>
                                        <div className="space-y-6">
                                            {reviews.data.map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="bg-gray-800 p-4 rounded-lg shadow border border-purple-600"
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        {review.game?.cover_url && (
                                                            <img
                                                                src={review.game.cover_url}
                                                                alt={review.game.title}
                                                                className="w-24 h-32 object-cover rounded border border-purple-500"
                                                            />
                                                        )}
                                                        <div>
                                                            <h3 className="text-xl font-semibold text-neon-green">
                                                                {review.game?.title}
                                                            </h3>
                                                            <div className="mt-2">
                                                                <span className="text-purple-400 font-semibold">
                                                                    {user.name}
                                                                </span>{" "}
                                                                valoró con{" "}
                                                                <span className="text-neon-green font-bold">
                                                                    {review.rating}/10
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-300 mt-2">{review.review_text}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Paginación */}
                                        <div className="mt-8 flex justify-center">
                                            <div className="flex gap-2 flex-wrap">
                                                {reviews.links.map((link, i) => (
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
                                    </>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
