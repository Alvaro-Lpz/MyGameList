import React from "react";

export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p className="text-gray-400 mt-6">Este juego aún no tiene reseñas.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-2xl font-bold text-neon-green">Reseñas:</h2>
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-gray-800 p-4 rounded-lg shadow border border-purple-600"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-300 font-semibold">{review.user.name}</span>
            <span className="text-neon-green font-bold">{review.rating}/10</span>
          </div>
          <p className="text-gray-200">{review.review_text}</p>
        </div>
      ))}
    </div>
  );
}
