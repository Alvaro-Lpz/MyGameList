import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";

export default function Header() {
  const { auth } = usePage().props;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    router.get(route("game.search"), { q: searchQuery });
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white shadow p-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-neon-green">
            MyGameList
          </Link>
        </div>

        {/* Botón menú móvil */}
        <button
          className="md:hidden text-neon-green focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú móvil"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Menú principal y buscador en desktop */}
        <nav className="hidden md:flex md:items-center md:space-x-6 flex-grow">
          <Link
            href={route("game.search")}
            className="text-purple-300 hover:text-neon-green font-semibold transition"
          >
            Explorar
          </Link>

          <form
            onSubmit={submitSearch}
            className="flex ml-6 max-w-md w-full"
            role="search"
          >
            <input
              type="text"
              name="search"
              aria-label="Buscar usuarios"
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-2 rounded-l-md border border-purple-600 bg-gray-800 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent"
              style={{ boxSizing: "border-box" }}
            />
            <button
              type="submit"
              className="bg-neon-green hover:bg-green-500 font-semibold px-4 rounded-r-md transition"
            >
              Buscar
            </button>
          </form>
        </nav>

        {/* Menú usuario / login desktop */}
        <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
          {!auth.user ? (
            <>
              <Link href="/login" className="hover:text-purple-400">
                Iniciar sesión
              </Link>
              <Link href="/register" className="hover:text-purple-400">
                Registrarse
              </Link>
            </>
          ) : (
            <div className="relative inline-block text-left">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-purple-400 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                {auth.user.name}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg z-50">
                  <Link
                    href={route("user.profile", auth.user.name)}
                    className="block px-4 py-2 hover:bg-gray-600"
                  >
                    Perfil
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-600"
                  >
                    Configuración
                  </Link>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                  >
                    Cerrar sesión
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-700 border-t border-purple-600 mt-2 p-4 space-y-4">
          <Link
            href={route("game.search")}
            className="block text-purple-300 hover:text-neon-green font-semibold transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explorar
          </Link>

          <form
            onSubmit={submitSearch}
            className="flex"
            role="search"
          >
            <input
              type="text"
              name="search"
              aria-label="Buscar juegos"
              placeholder="Buscar juegos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow px-4 py-2 rounded-l-md border border-purple-600 bg-gray-800 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-neon-green hover:bg-green-500 text-black font-semibold px-4 rounded-r-md transition"
            >
              Buscar
            </button>
          </form>

          {!auth.user ? (
            <>
              <Link
                href="/login"
                className="block hover:text-purple-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="block hover:text-purple-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Registrarse
              </Link>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                href={route("user.profile", auth.user.name)}
                className="block px-4 py-2 hover:bg-gray-600 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Perfil
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 hover:bg-gray-600 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Configuración
              </Link>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-600 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cerrar sesión
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
