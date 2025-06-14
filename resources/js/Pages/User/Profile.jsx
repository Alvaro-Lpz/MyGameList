import { useState } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Nav from "./Partials/Nav";

export default function Profile() {
    const { user, listsCount, reviewsCount, recentReviews, auth } =
        usePage().props;

    const [editingBio, setEditingBio] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        bio: user.bio || "",
    });

    const submitBio = (e) => {
        e.preventDefault();
        patch(route("user.bio.update", user.name), {
            preserveScroll: true,
            onSuccess: () => setEditingBio(false),
        });
    };

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

                                {editingBio ? (
                                    <form onSubmit={submitBio}>
                                        <textarea
                                            className="w-full bg-gray-900 text-white p-2 rounded border border-purple-500"
                                            rows={4}
                                            value={data.bio}
                                            onChange={(e) =>
                                                setData("bio", e.target.value)
                                            }
                                        />
                                        {errors.bio && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.bio}
                                            </p>
                                        )}

                                        <div className="mt-2 flex gap-2">
                                            <button
                                                type="submit"
                                                className="px-4 py-1 bg-neon-green rounded font-semibold hover:bg-green-400"
                                                disabled={processing}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingBio(false);
                                                    setData(
                                                        "bio",
                                                        user.bio || ""
                                                    );
                                                }}
                                                className="px-4 py-1 bg-red-600 text-white rounded font-semibold hover:bg-red-400"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-300 whitespace-pre-line">
                                            {user.bio ||
                                                "Este usuario aún no ha escrito una biografía."}
                                        </p>
                                        {auth.user.id === user.id && (
                                            <button
                                                onClick={() =>
                                                    setEditingBio(true)
                                                }
                                                className="mt-2 text-sm text-purple-400 hover:text-neon-green transition"
                                            >
                                                Editar biografía
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="bg-gray-800 p-4 rounded shadow border border-purple-600">
                                <h2 className="text-lg font-semibold text-purple-300">
                                    Listas creadas
                                </h2>
                                <p className="text-neon-green text-2xl font-bold">
                                    {listsCount}
                                </p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded shadow border border-purple-600">
                                <h2 className="text-lg font-semibold text-purple-300">
                                    Reviews publicadas
                                </h2>
                                <p className="text-neon-green text-2xl font-bold">
                                    {reviewsCount}
                                </p>
                            </div>
                        </aside>

                        {/* Contenido principal */}
                        <section className="md:col-span-3">
                            <h2 className="text-2xl font-bold text-purple-300 mb-4">
                                Últimas reviews
                            </h2>
                            {recentReviews.data.length === 0 ? (
                                <p className="text-gray-400">
                                    Este usuario aún no ha escrito ninguna
                                    review.
                                </p>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {recentReviews.data.map((review) => (
                                            <div
                                                key={review.id}
                                                className="bg-gray-800 p-4 rounded-lg shadow border border-purple-600"
                                            >
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

                                                    <div>
                                                        <h3 className="text-xl font-semibold text-neon-green">
                                                            {review.game.title}
                                                        </h3>
                                                        <div className="mt-2">
                                                            <Link
                                                                href={route(
                                                                    "user.profile",
                                                                    review.user
                                                                        .name
                                                                )}
                                                                className="text-purple-400 font-semibold hover:underline"
                                                            >
                                                                {
                                                                    review.user
                                                                        .name
                                                                }
                                                            </Link>{" "}
                                                            valoró con{" "}
                                                            <span className="text-neon-green font-bold">
                                                                {review.rating}
                                                                /10
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

                                    {/* Paginación */}
                                    <div className="mt-8 flex justify-center gap-2 flex-wrap">
                                        {recentReviews.links &&
                                            recentReviews.links.length > 1 && (
                                                <div className="mt-8 flex justify-center">
                                                    <div className="flex gap-2 flex-wrap">
                                                        {recentReviews.links.map(
                                                            (link, i) => (
                                                                <button
                                                                    key={i}
                                                                    disabled={
                                                                        !link.url
                                                                    }
                                                                    onClick={() =>
                                                                        link.url &&
                                                                        router.visit(
                                                                            link.url
                                                                        )
                                                                    }
                                                                    className={`px-4 py-2 rounded border border-purple-500 text-sm ${
                                                                        link.active
                                                                            ? "bg-neon-green text-black font-bold"
                                                                            : "bg-gray-800 text-purple-300 hover:bg-purple-600"
                                                                    }`}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
