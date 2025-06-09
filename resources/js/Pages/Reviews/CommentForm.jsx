import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function CommentForm({ reviewId }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(`/reviews/${reviewId}/comments`, {
      comment_text: commentText,
    });
    setCommentText(""); // limpia tras enviar
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full bg-gray-800 text-white p-2 rounded border border-purple-500"
        placeholder="Escribe un comentario..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        required
      />
      <button
        type="submit"
        className="mt-2 bg-neon-green text-black px-4 py-2 rounded hover:bg-green-400 transition"
      >
        Comentar
      </button>
    </form>
  );
}