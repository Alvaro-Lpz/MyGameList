import React from "react";
import CommentForm from "./CommentForm";

export default function ReviewList({ reviews }) {
    if (reviews.length === 0) {
        return (
            <p className="text-gray-400 mt-6">
                Este juego aún no tiene reseñas.
            </p>
        );
    }

    return (
        <div className="mt-6 space-y-6">
            <h2 className="text-2xl font-bold text-neon-green">Reseñas:</h2>
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-gray-800 p-4 rounded-lg shadow border border-purple-600"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-300 font-semibold">
                            {review.user.name}
                        </span>
                        <span className="text-neon-green font-bold">
                            {review.rating}/10
                        </span>
                    </div>
                    <p className="text-gray-200 mb-2">{review.review_text}</p>

                    {/* Comentarios */}
                    {review.comments?.length > 0 && (
                        <div className="mt-3 space-y-2">
                            <h3 className="text-sm text-gray-400">Comentarios:</h3>
                            {review.comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="ml-2 pl-3 border-l-2 border-purple-600 text-sm"
                                >
                                    <p className="text-purple-400 font-semibold">
                                        {comment.user.name}
                                    </p>
                                    <p className="text-gray-300">{comment.comment_text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Formulario para añadir nuevo comentario */}
                    <div className="mt-4">
                        <CommentForm reviewId={review.id} />
                    </div>
                </div>
            ))}
        </div>
    );
}
