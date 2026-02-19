'use client';

import { useState } from 'react';
import { changePassword } from '@/app/actions/auth';
import { Loader2, Lock } from 'lucide-react';

export default function SettingsPage() {
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setMessage('');
        setIsSuccess(false);

        const result = await changePassword(null, formData);

        if (result?.message) {
            setMessage(result.message);
            setIsSuccess(!!result.success);
        }

        if (result?.success) {
            // Reset form
            const form = document.getElementById('password-form') as HTMLFormElement;
            form.reset();
        }

        setIsLoading(false);
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-serif font-light mb-8">Ajustes</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-brand-blue/10 rounded-lg">
                        <Lock className="w-5 h-5 text-brand-blue" />
                    </div>
                    <h2 className="text-xl font-medium">Cambiar Contraseña</h2>
                </div>

                <form id="password-form" action={handleSubmit} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg text-sm ${isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña Actual
                        </label>
                        <input
                            name="currentPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nueva Contraseña
                        </label>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-[#3A5F95] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Actualizar Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
}
