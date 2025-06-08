import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function ReviewForm({ igdb_id }) {
    const [rating, setRating] = useState("");
    const [reviewText, setReviewText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`/games/${igdb_id}/reviews`, {
            rating,
            review_text: reviewText,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 bg-gray-700 p-4 rounded-lg shadow-md"
        >
            <h2 className="text-xl font-bold text-neon-green mb-4">
                Escribe tu reseña
            </h2>

            <div className="mb-4">
                <label className="block text-purple-300 mb-1">
                    Puntuación (1-10):
                </label>
                <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full p-2 rounded bg-gray-800 text-white border border-purple-500"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-purple-300 mb-1">Tu reseña:</label>
                <textarea
                    className="w-full p-2 rounded bg-gray-800 text-white border border-purple-500"
                    rows="4"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-neon-green text-black font-bold py-2 px-4 rounded hover:bg-green-400 transition"
            >
                Publicar reseña
            </button>
        </form>
    );
}
