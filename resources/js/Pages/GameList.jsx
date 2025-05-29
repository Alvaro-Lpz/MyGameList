import React from "react";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Ziggy } from "@/ziggy";
import { Link } from "@inertiajs/react";
// Swiper es para los carruseles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function GameList() {
    // Aquí se extrae la propiedad games que viene desde el backend
    const { games } = usePage().props;

    return (
        // Aqui va lo que seria el contenido de la vista
    <>
      {/* <Header /> */}
      <div className="min-h-screen bg-gray-900 text-white font-mono p-6">
        <div className="max-w-5xl mx-auto">

          {/* Introducción */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-neon-green mb-4 tracking-widest">
              MyGameList
            </h1>
            <p className="text-lg text-purple-300">
              Crea tu lista de videojuegos, descubre nuevos títulos y comparte tus reseñas con la comunidad.
            </p>
            <Link
              href="/register"
              className="inline-block mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition"
            >
              ¡Empieza ahora!
            </Link>
          </div>

          {/* Carrusel de Juegos */}
          <h2 className="text-3xl text-purple-400 font-bold mb-6">
            Juegos destacados
          </h2>
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
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            loop={true}
            className="mb-12"
          >
            {games.map((game) => (
              <SwiperSlide key={game.id}>
                <Link
                  href={route("game.detail", game.id)}
                  className="bg-gray-800 border border-purple-500 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-md block"
                >
                  {game.cover_url && (
                    <img
                      src={game.cover_url}
                      alt={`Portada de ${game.title}`}
                      className="w-full h-60 object-cover"
                    />
                  )}
                  <div className="p-3 text-center">
                    <h3 className="text-lg font-semibold text-neon-green">
                      {game.title}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
    );
}
