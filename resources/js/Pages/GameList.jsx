import React, { useState } from "react";
import { usePage } from "@inertiajs/react"; // para acceder a las props que vienen del backend con inertia
import { route } from "ziggy-js";
import { Ziggy } from "@/ziggy";
import { Link } from "@inertiajs/react"; // navegacion entre rutas con Inertia sin recargar
import { router } from "@inertiajs/react"; // helper de Ziggy para generar URLs de rutas Laravel
// Swiper es para los carruseles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "@/Components/Header";

export default function GameList() {
  // Aquí se extrae la propiedad games que viene desde el backend
  const { games, userLists } = usePage().props;
  const [dropdown, setDropdown] = useState(null);
  const [selected, setSelected] = useState({});

  // envia al backend los ids de listas seleccionadas para el juego actual
  const handleAdd = (gameId) => {
    const lists = selected[gameId] || [];
    if (lists.length === 0) return;

    router.post(`/games/${gameId}/add-to-lists`, { lists });
    setDropdown(null); // cerrar dropdown
  };

  // abre o cierra el dropdown para un juego
  const toggle = (id) => setDropdown(dropdown === id ? null : id);

  return (
    // Aqui va lo que seria el contenido de la vista
    <>
      <Header />

      <div className="min-h-screen bg-gray-900 text-white font-mono p-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-lg text-purple-300">
              Crea tus listas de videojuegos, descubre nuevos títulos y comparte tus reseñas con la comunidad.
            </p>
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
                <div className="relative bg-gray-800 border border-purple-500 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-md">
                  {/* Botón añadir a listas */}
                  {userLists.length > 0 && (
                    <div className="absolute top-2 right-2 z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggle(game.id);
                        }}
                        className="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700"
                      >
                        Añadir a:
                      </button>

                      {dropdown === game.id && (
                        <div className="absolute right-0 mt-1 bg-gray-800 border border-purple-500 rounded shadow z-30 p-2 w-48">
                          <select
                            multiple
                            className="w-full text-sm bg-gray-900 border border-purple-400 rounded text-white"
                            onChange={(e) => {
                              const values = Array.from(e.target.selectedOptions).map((o) => parseInt(o.value));
                              setSelected((prev) => ({ ...prev, [game.id]: values }));
                            }}
                          >
                            {userLists.map((list) => (
                              <option key={list.id} value={list.id}>
                                {list.title}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAdd(game.id);
                            }}
                            className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-1 rounded text-xs"
                          >
                            Agregar
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contenido del juego */}
                  <Link
                    href={route("game.detail", game.id)}
                    className="block"
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
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
