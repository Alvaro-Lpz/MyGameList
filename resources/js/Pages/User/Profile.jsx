import React from "react";
import { Link, usePage } from "@inertiajs/react";
import Header from "@/Components/Header";
import Nav from "./Partials/Nav";

export default function Profile() {
    const { user, listsCount, reviewsCount, recentReviews, auth } = usePage().props;

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Imagen + Nombre */}
                    <Nav user={user} auth={auth} />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Aside izquierdo */}
                        <aside className="md:col-span-1 space-y-4">
                            <div className="bg-gray-800 p-4 rounded shadow border border-purple-600">
                                <h2 className="text-lg font-semibold text-purple-300 mb-2">
                                    Biografía
                                </h2>
                                <p className="text-sm text-gray-300">
                                    {user.bio || "Este usuario aún no ha escrito una biografía."}
                                </p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded shadow border border-purple-600">
                                <h2 className="text-lg font-semibold text-purple-300">
                                    Listas creadas
                                </h2>
                                <p className="text-neon-green text-2xl font-bold">{listsCount}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded shadow border border-purple-600">
                                <h2 className="text-lg font-semibold text-purple-300">
                                    Reviews publicadas
                                </h2>
                                <p className="text-neon-green text-2xl font-bold">{reviewsCount}</p>
                            </div>
                        </aside>

                        {/* Contenido principal */}
                        <section className="md:col-span-3">
                            <h2 className="text-2xl font-bold text-purple-300 mb-4">
                                Últimas reviews
                            </h2>
                            {recentReviews.length === 0 ? (
                                <p className="text-gray-400">Este usuario aún no ha escrito ninguna review.</p>
                            ) : (
                                <div className="space-y-6">
                                    {recentReviews.map((review) => (
                                        <div key={review.id} className="bg-gray-800 p-4 rounded-lg shadow border border-purple-600">
                                            <div className="flex items-start space-x-4">
                                                {review.game?.cover_url && (
                                                    <Link href={route("game.detail", { id: review.game.id })}>
                                                        <img
                                                            src={review.game.cover_url}
                                                            alt={review.game.title}
                                                            className="w-24 h-32 object-cover rounded border border-purple-500 hover:opacity-80 transition"
                                                        />
                                                    </Link>
                                                )}
                                                <div>
                                                    <h3 className="text-xl font-semibold text-neon-green">
                                                        <Link
                                                            href={route("game.detail", { id: review.game.id })}
                                                            className="hover:underline"
                                                        >
                                                            {review.game.title}
                                                        </Link>
                                                    </h3>
                                                    <div className="mt-2">
                                                        <Link
                                                            href={route("user.profile", review.user.name)}
                                                            className="text-purple-400 font-semibold hover:underline"
                                                        >
                                                            {review.user.name}
                                                        </Link>{" "}
                                                        valoró con{" "}
                                                        <span className="text-neon-green font-bold">
                                                            {review.rating}/10
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 mt-2">
                                                        {review.review_text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
