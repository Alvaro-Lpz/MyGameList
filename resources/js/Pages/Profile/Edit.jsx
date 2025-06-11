import Header from '@/Components/Header';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-neon-green tracking-wide mb-8">
                        Configuración de perfil
                    </h2>

                    <div className="space-y-10">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />

                        <UpdatePasswordForm />

                        <DeleteUserForm />
                    </div>
                </div>
            </main>
        </>
    );
}
