// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { user, lists } = usePage().props;

    return (
        <>

            <Header />

            <div className="min-h-screen bg-gray-900 text-white p-6">
                <Head title="Dashboard" />

                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neon-green tracking-widest">
                            Tus Listas
                        </h1>
                        {/* <a
                        href={route('create-list')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
                    >
                        Crear Lista
                    </a> */}
                    </div>

                    {lists.map((list) => (
                        <div
                            key={list.id}
                            className="bg-gray-800 border border-purple-500 rounded-lg shadow-md p-6 mb-8"
                        >
                            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
                                {list.title}
                            </h2>
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {list.games.map((game) => (
                                    <li key={game.id}>
                                        <img
                                            src={game.cover_url}
                                            alt={game.title}
                                            className="w-full h-auto rounded-lg border-2 border-purple-700 hover:scale-105 hover:border-neon-green transition-transform duration-300"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}