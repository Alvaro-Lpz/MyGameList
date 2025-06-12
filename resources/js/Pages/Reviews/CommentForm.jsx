import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function CommentForm({ reviewId, comment = null, onCancel = null }) {
  const { auth } = usePage().props;
  const isEdit = !!comment;
  const [commentText, setCommentText] = useState(comment ? comment.comment_text : "");

  useEffect(() => {
    setCommentText(comment ? comment.comment_text : "");
  }, [comment]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      router.patch(route(`reviews.comments.update`, comment.id), {
        comment_text: commentText,
      }, {
        onSuccess: () => {
          if (onCancel) onCancel(); // Oculta el formulario si se edita correctamente
        },
        preserveScroll: true,
      });
    } else {
      router.post(`/reviews/${reviewId}/comments`, {
        comment_text: commentText,
      }, {
        onSuccess: () => setCommentText(""),
        preserveScroll: true,
      });
    }
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
      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          className="bg-neon-green px-4 py-2 rounded hover:bg-green-400 transition text-sm"
        >
          {isEdit ? "Guardar cambios" : "Comentar"}
        </button>
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-purple-300 hover:text-red-400 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
