import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function UpdateAvatarForm() {
    const { auth } = usePage().props;
    const fileInputRef = useRef();
    const [preview, setPreview] = useState(
        auth.user.img_path ? `/storage/${auth.user.img_path}` : null
    );

    const { data, setData, post, progress, errors, processing, recentlySuccessful } = useForm({
        avatar: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.avatar.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                if (fileInputRef.current) fileInputRef.current.value = null;
            },
        });
    };

    return (
        <section className="mt-8">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Imagen de perfil
            </h3>
            <form onSubmit={submit} className="space-y-4">
                <div className="flex items-center gap-6">
                    <img
                        src={preview || `https://api.dicebear.com/7.x/lorelei/svg?seed=${auth.user.name}`}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full border-4 border-purple-500 shadow"
                    />
                    <div className="flex flex-col gap-2">
                        <InputLabel htmlFor="avatar" value="Selecciona una imagen" />
                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="text-sm text-gray-300 file:bg-purple-600 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer bg-gray-900 border border-purple-500 rounded"
                        />
                        <InputError message={errors.avatar} className="mt-1" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || !data.avatar}>Guardar imagen</PrimaryButton>
                    {progress && (
                        <p className="text-sm text-purple-400">{progress.percentage}%</p>
                    )}
                    {recentlySuccessful && (
                        <p className="text-sm text-neon-green">Imagen actualizada.</p>
                    )}
                </div>
            </form>
        </section>
    );
}
