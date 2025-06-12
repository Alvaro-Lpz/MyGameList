import React, { useState } from "react";
import { router, usePage, useForm } from "@inertiajs/react";
import CommentForm from "./CommentForm";

export default function ReviewList({ reviews }) {
    const { auth } = usePage().props;
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [reviewEdits, setReviewEdits] = useState({});

    if (reviews.length === 0) {
        return (
            <p className="text-gray-400 mt-6">
                Este juego aún no tiene reseñas.
            </p>
        );
    }

    const handleReviewUpdate = (reviewId) => {
        const data = {
            review_text: reviewEdits[reviewId]?.review_text || "",
            rating: reviewEdits[reviewId]?.rating || 0,
        };

        router.patch(route("reviews.update", reviewId), data, {
            onSuccess: () => setEditingReviewId(null),
        });
    };

    return (
        <div className="mt-6 space-y-6">
            <h2 className="text-2xl font-bold text-neon-green">Reseñas:</h2>

            {reviews.map((review) => {
                const isReviewOwner = auth.user?.id === review.user.id;

                return (
                    <div
                        key={review.id}
                        className="bg-gray-800 p-4 rounded-lg shadow border border-purple-600"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-300 font-semibold">{review.user.name}</span>
                            <span className="text-neon-green font-bold">{review.rating}/10</span>
                        </div>

                        {editingReviewId === review.id ? (
                            <div className="space-y-2">
                                <textarea
                                    className="w-full bg-gray-900 text-white p-2 rounded border border-purple-500"
                                    rows={3}
                                    defaultValue={review.review_text}
                                    onChange={(e) =>
                                        setReviewEdits((prev) => ({
                                            ...prev,
                                            [review.id]: {
                                                ...prev[review.id],
                                                review_text: e.target.value,
                                            },
                                        }))
                                    }
                                />
                                <input
                                    type="number"
                                    min={0}
                                    max={10}
                                    defaultValue={review.rating}
                                    className="bg-gray-900 text-white p-2 rounded border border-purple-500 w-20"
                                    onChange={(e) =>
                                        setReviewEdits((prev) => ({
                                            ...prev,
                                            [review.id]: {
                                                ...prev[review.id],
                                                rating: e.target.value,
                                            },
                                        }))
                                    }
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleReviewUpdate(review.id)}
                                        className="bg-neon-green text-black px-4 py-1 rounded hover:bg-green-400 transition"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() => setEditingReviewId(null)}
                                        className="text-purple-300 hover:text-red-400 transition"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-200 mb-2">{review.review_text}</p>

                                {isReviewOwner && (
                                    <div className="flex gap-4 text-sm mt-1">
                                        <button
                                            onClick={() => setEditingReviewId(review.id)}
                                            className="text-purple-300 hover:text-neon-green"
                                        >
                                            Editar reseña
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("¿Eliminar esta reseña?")) {
                                                    router.delete(route("reviews.destroy", review.id), {
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            Eliminar reseña
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Comentarios */}
                        {review.comments?.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <h3 className="text-sm text-gray-400">Comentarios:</h3>
                                {review.comments.map((comment) => {
                                    const isCommentOwner = auth.user?.id === comment.user_id;

                                    return (
                                        <div
                                            key={comment.id}
                                            className="ml-2 pl-3 border-l-2 border-purple-600 text-sm"
                                        >
                                            {editingCommentId === comment.id ? (
                                                <CommentForm
                                                    reviewId={review.id}
                                                    comment={comment}
                                                    onCancel={() => setEditingCommentId(null)}
                                                />
                                            ) : (
                                                <>
                                                    <p className="text-purple-400 font-semibold">
                                                        {comment.user.name}
                                                    </p>
                                                    <p className="text-gray-300">{comment.comment_text}</p>

                                                    {isCommentOwner && (
                                                        <div className="flex gap-2 mt-1">
                                                            <button
                                                                onClick={() => setEditingCommentId(comment.id)}
                                                                className="text-xs text-purple-300 hover:text-neon-green"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm("¿Eliminar este comentario?")) {
                                                                        router.delete(
                                                                            route("reviews.comments.destroy", comment.id),
                                                                            { preserveScroll: true }
                                                                        );
                                                                    }
                                                                }}
                                                                className="text-xs text-red-400 hover:text-red-600"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Nuevo comentario */}
                        <div className="mt-4">
                            <CommentForm reviewId={review.id} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
