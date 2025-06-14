import React, { useState } from "react";
import { usePage, Link, router, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Nav from "./Partials/Nav";

export default function Reviews() {
    const { user, auth, reviews } = usePage().props;

    const [editingReviewId, setEditingReviewId] = useState(null);
    const { data, setData, patch, processing, errors } = useForm({
        review_text: '',
        rating: '',
    });

    const startEditing = (review) => {
        setEditingReviewId(review.id);
        setData({
            review_text: review.review_text,
            rating: review.rating,
        });
    };

    const submit = (e, reviewId) => {
        e.preventDefault();
        patch(route('reviews.update', reviewId), {
            onSuccess: () => setEditingReviewId(null),
        });
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-6xl mx-auto">

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
                                                <div key={review.id} className="bg-gray-800 p-4 rounded-lg border border-purple-600">
                                                    <div className="flex items-start space-x-4">
                                                        <Link
                                                        href={route(
                                                            "game.detail",
                                                            review.game?.igdb_id
                                                        )}
                                                        className="block w-24"
                                                    >
                                                        {review.game
                                                            ?.cover_url && (
                                                            <img
                                                                src={
                                                                    review.game
                                                                        .cover_url
                                                                }
                                                                alt={`Portada de ${review.game.title}`}
                                                                className="w-24 h-32 object-cover rounded border border-purple-500"
                                                            />
                                                        )}
                                                    </Link>
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-semibold text-neon-green">{review.game.title}</h3>

                                                            <div className="mt-2">
                                                                <span className="text-purple-400 font-semibold">{review.user.name}</span>{" "}
                                                                valoró con <span className="text-neon-green font-bold">{review.rating}/10</span>
                                                            </div>

                                                            {editingReviewId === review.id ? (
                                                                <form onSubmit={(e) => submit(e, review.id)} className="mt-2 space-y-2">
                                                                    <textarea
                                                                        className="w-full bg-gray-900 p-2 rounded border border-purple-500"
                                                                        rows={4}
                                                                        value={data.review_text}
                                                                        onChange={(e) => setData('review_text', e.target.value)}
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        max="10"
                                                                        value={data.rating}
                                                                        onChange={(e) => setData('rating', e.target.value)}
                                                                        className="w-20 bg-gray-900 p-1 rounded border border-purple-500"
                                                                    />
                                                                    {errors.review_text && <p className="text-red-400 text-sm">{errors.review_text}</p>}
                                                                    <div className="flex gap-3 mt-2">
                                                                        <button
                                                                            type="submit"
                                                                            className="px-3 py-1 bg-neon-green text-black rounded font-semibold"
                                                                            disabled={processing}
                                                                        >
                                                                            Guardar
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setEditingReviewId(null)}
                                                                            className="text-sm text-purple-400 hover:text-red-400"
                                                                        >
                                                                            Cancelar
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            ) : (
                                                                <p className="text-gray-300 mt-2 whitespace-pre-line">{review.review_text}</p>
                                                            )}

                                                            {auth.user.id === review.user.id && editingReviewId !== review.id && (
                                                                <div className="flex gap-4 mt-2">
                                                                    <button
                                                                        onClick={() => startEditing(review)}
                                                                        className="text-sm text-purple-400 hover:text-neon-green"
                                                                    >
                                                                        Editar reseña
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
                                                                                router.delete(route('reviews.destroy', review.id), {
                                                                                    preserveScroll: true,
                                                                                });
                                                                            }
                                                                        }}
                                                                        className="text-sm text-red-400 hover:text-red-600"
                                                                    >
                                                                        Eliminar reseña
                                                                    </button>
                                                                </div>
                                                            )}
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
