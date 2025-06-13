import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registrarse" />

            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-gray-900 border border-purple-600 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center" style={{color: "#fff"}}>
                        Crear cuenta
                    </h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Nombre" className="text-purple-300" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full bg-gray-800 text-white border border-purple-500 focus:ring-neon-green"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Correo electrónico" className="text-purple-300" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-gray-800 text-white border border-purple-500 focus:ring-neon-green"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="text-purple-300" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-gray-800 text-white border border-purple-500 focus:ring-neon-green"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" className="text-purple-300" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full bg-gray-800 text-white border border-purple-500 focus:ring-neon-green"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-purple-400">
                                ¿Ya tienes cuenta?{' '}
                                <Link
                                    href={route('login')}
                                    className="text-neon-green hover:underline"
                                >
                                    Inicia sesión
                                </Link>
                            </p>

                            <PrimaryButton
                                className="bg-neon-green text-black hover:bg-green-400 transition font-bold py-2 px-4 rounded"
                                disabled={processing}
                            >
                                Registrarse
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
