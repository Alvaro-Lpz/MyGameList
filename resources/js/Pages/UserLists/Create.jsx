// import React from "react";
import { useForm } from "@inertiajs/react";


export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user-lists.store'));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl p-8 border border-purple-600">
                <h1 className="text-3xl font-bold mb-6 text-neon-green">Crear Lista</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-purple-400">Título</label>
                        <input
                            className="w-full bg-gray-700 border border-purple-500 rounded px-4 py-2"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-purple-400">Descripción</label>
                        <textarea
                            className="w-full bg-gray-700 border border-purple-500 rounded px-4 py-2"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded shadow"
                        disabled={processing}
                    >
                        Crear Lista
                    </button>
                </form>
            </div>
        </div>
    );
}