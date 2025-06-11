import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import UpdateAvatarForm from './UpdateAvatarForm';

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            bio: user.bio || "",
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className="bg-gray-800 p-6 rounded-lg shadow-md border border-purple-500">
            <h3 className="text-2xl font-semibold text-purple-300 mb-4">Información de perfil</h3>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full bg-gray-900 border-purple-500"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-gray-900 border-purple-500"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="text-sm text-yellow-300">
                        Tu correo electrónico no está verificado.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="underline hover:text-neon-green"
                        >
                            Haz clic aquí para reenviar el correo de verificación.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-green-500">
                                Se ha enviado un nuevo enlace de verificación.
                            </p>
                        )}
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="bio" value="Biografía" />
                    <textarea
                        id="bio"
                        className="mt-1 block w-full rounded p-2 border-gray-300 text-sm bg-gray-900 border-purple-500"
                        value={data.bio || ""}
                        onChange={(e) => setData("bio", e.target.value)}
                        rows={4}
                    />
                    <InputError className="mt-2" message={errors.bio} />
                </div>


                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-neon-green">Guardado correctamente.</p>
                    </Transition>
                </div>

            </form>

            <UpdateAvatarForm />

        </section>
    );
}