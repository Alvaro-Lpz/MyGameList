import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Iniciar sesión" />

            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-gray-900 border border-purple-600 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center" style={{color: "#fff"}}>
                        Iniciar sesión
                    </h2>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Correo electrónico" className="text-purple-300" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-gray-800 text-white border border-purple-500 focus:ring-neon-green"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
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
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm text-purple-300">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2">Recuérdame</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-purple-400 hover:text-neon-green transition"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <div className="pt-4">
                            <PrimaryButton
                                className="w-full bg-neon-green text-black hover:bg-green-400 transition font-bold py-2 px-4 rounded"
                                disabled={processing}
                            >
                                Entrar
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-purple-400">
                            ¿No tienes cuenta?{' '}
                            <Link href={route('register')} className="text-neon-green hover:underline">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
