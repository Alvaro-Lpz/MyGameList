import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Link, router } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "@/Components/Header";
import AddToList from "@/Components/AddToList";

export default function GameList() {
  const { games, userLists, auth, recentReviews } = usePage().props;
  const [dropdown, setDropdown] = useState(null);
  const [selected, setSelected] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);

  const handleAdd = (gameId) => {
    const lists = selected[gameId] || [];
    if (lists.length === 0) return;
    router.post(`/games/${gameId}/add-to-lists`, { lists });
    setDropdown(null);
  };

  const toggle = (id) => setDropdown(dropdown === id ? null : id);

  return (
    <>
      <Header />

      <style>
        {`.swiper-pagination-bullet {
              background-color: #9333ea !important; /* púrpura */
              opacity: 0.5;
          }

          .swiper-pagination-bullet-active {
          background-color: #39ff14 !important; /* neon green */
          opacity: 1;
          }
        `}
      </style>

      <div className="min-h-screen bg-gray-900 text-white font-mono">
        {/* Hero principal */}
        <section className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-green mb-4 tracking-widest animate-pulse">
            MyGameList
          </h1>
          <p className="text-purple-300 max-w-2xl mx-auto text-lg mb-6">
            Crea listas personalizadas, valora tus juegos favoritos y comenta junto a otros jugadores. ¡Todo desde un mismo sitio!
          </p>
          {!auth?.user && (
            <div className="flex justify-center gap-4 mt-4">
              <Link href={route('register')} className="px-6 py-3 bg-neon-green text-black font-bold rounded hover:bg-green-400 transition">Únete ahora</Link>
              <Link href={route('login')} className="px-6 py-3 border border-purple-500 text-purple-300 hover:text-white hover:bg-purple-600 rounded transition">Iniciar sesión</Link>
            </div>
          )}
        </section>

        {/* Funcionalidades */}
        <section className="py-12 max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl text-purple-400 font-bold mb-8">¿Qué puedes hacer?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded shadow border border-purple-600">
              <h3 className="text-neon-green text-xl font-semibold mb-2">Crea tus listas</h3>
              <p className="text-purple-300">Organiza tus juegos favoritos por categorías: completados, en espera, favoritos o como quieras.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded shadow border border-purple-600">
              <h3 className="text-neon-green text-xl font-semibold mb-2">Escribe reviews</h3>
              <p className="text-purple-300">Deja tu opinión y valora los juegos que has jugado. Otros usuarios pueden comentarlas.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded shadow border border-purple-600">
              <h3 className="text-neon-green text-xl font-semibold mb-2">Descubre juegos</h3>
              <p className="text-purple-300">Explora títulos nuevos gracias a nuestras búsquedas por género, puntuación y tendencias.</p>
            </div>
          </div>
        </section>

        {/* Carrusel */}
        <section className="px-6 max-w-5xl mx-auto">
          <h2 className="text-3xl text-purple-400 font-bold mb-6">Juegos destacados</h2>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            navigation
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            autoplay={{ delay: 4000 }}
            loop={true}
            style={{ paddingBottom: "3rem"}}
          >
            {games.map((game) => (
              <SwiperSlide key={game.id} className="overflow-visible">
                <div className="relative bg-gray-800 border border-purple-500 rounded-xl overflow-visible hover:scale-105 transition-transform duration-300 shadow-md">
                  {userLists?.length > 0 && (
                    <div className="absolute top-3 right-3 z-90">
                      <AddToList gameId={game.id} lists={userLists} swiper={swiperInstance} />
                    </div>
                  )}

                  <Link href={route("game.detail", game.id)} className="block">
                    {game.cover_url && (
                      <img
                        src={game.cover_url}
                        alt={`Portada de ${game.title}`}
                        className="w-full h-60 object-cover"
                      />
                    )}
                    <div className="p-3 text-center">
                      <h3 className="text-lg font-semibold text-neon-green truncate">
                        {game.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Últimas reseñas destacadas */}
        <section className="bg-gray-800 py-12 mt-12 border-t border-purple-600">
          <h2 className="text-2xl font-bold text-center text-purple-300 mb-10">Últimas reseñas</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4">
            {recentReviews.map((review) => (
              <div key={review.id} className="bg-gray-900 p-6 rounded border border-purple-500 shadow">
                <div className="flex items-start gap-4">
                  {review.game?.cover_url && (
                    <img
                      src={review.game.cover_url}
                      alt={review.game.title}
                      className="w-20 h-28 object-cover rounded border border-purple-500"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-neon-green font-bold text-lg mb-1">
                      {review.game?.title}
                    </h3>
                    <div className="text-sm text-purple-300 mb-2">
                      por <span className="font-semibold">{review.user.name}</span> — <span className="text-neon-green">{review.rating}/10</span>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-4">
                      {review.review_text}
                    </p>
                    <Link
                      href={route("game.detail", review.game.igdb_id)}
                      className="inline-block mt-3 text-xs text-purple-300 hover:text-neon-green"
                    >
                      Ver más sobre este juego →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
