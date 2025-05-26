import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";
import { list } from 'postcss';

export default function Dashboard() {
    const { user, lists } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>

            <a href={route('create-list')}>Crear lista</a>

            {lists.map(list => (
                <div
                    key={list.id}
                    className="bg-gray-100 rounded-lg shadow-md p-6 mb-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {list.title}
                    </h2>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {list.games.map(game => (
                            <li key={game.id}>
                                <img
                                    src={game.cover_url}
                                    alt=""
                                    className="w-full h-auto rounded-lg hover:scale-105 transition-transform"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

        </AuthenticatedLayout>
    );
}
