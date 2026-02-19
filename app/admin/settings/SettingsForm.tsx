'use client';

import { useActionState } from 'react';
import { updateHeroImage, updateAboutSettings } from '@/app/actions/settings';

const initialState = {
    message: '',
    success: false,
};

export function SettingsForm({
    currentHeroImage,
    aboutSettings
}: {
    currentHeroImage: string,
    aboutSettings?: {
        title: string,
        description: string,
        image: string | null
    }
}) {
    const [heroState, heroAction, isHeroPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await updateHeroImage(formData);
        return result;
    }, initialState);

    const [aboutState, aboutAction, isAboutPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await updateAboutSettings(formData);
        return result;
    }, initialState);

    return (
        <div className="space-y-8">
            {/* Hero Image Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium mb-6">Imagen de Portada (Hero)</h2>

                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Imagen Actual:</p>
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={currentHeroImage}
                            alt="Current Hero"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <form action={heroAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subir Nueva Imagen
                        </label>
                        <input
                            type="file"
                            name="heroImage"
                            accept="image/*"
                            required
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-brand-blue/10 file:text-brand-blue
                                hover:file:bg-brand-blue/20"
                        />
                    </div>

                    {heroState?.message && (
                        <div className={`p-3 rounded-lg text-sm ${heroState.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {heroState.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isHeroPending}
                        className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-[#3A5F95] transition-colors disabled:opacity-50"
                    >
                        {isHeroPending ? 'Subiendo...' : 'Guardar Cambios'}
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                        * Se recomienda una imagen horizontal de alta calidad (min 1920x1080).
                    </p>
                </form>
            </div>

            {/* About Me Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium mb-6">Página "Acerca de Mí"</h2>

                <form action={aboutAction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            type="text"
                            name="aboutTitle"
                            defaultValue={aboutSettings?.title || 'Sobre la Artista'}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="aboutDescription"
                            rows={6}
                            defaultValue={aboutSettings?.description || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de Perfil</label>
                        {aboutSettings?.image && (
                            <div className="mb-4 w-32 h-32 relative rounded-full overflow-hidden bg-gray-100">
                                <img src={aboutSettings.image} alt="About" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <input
                            type="file"
                            name="aboutImage"
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20"
                        />
                    </div>

                    {aboutState?.message && (
                        <div className={`p-3 rounded-lg text-sm ${aboutState.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {aboutState.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isAboutPending}
                        className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-[#3A5F95] transition-colors disabled:opacity-50"
                    >
                        {isAboutPending ? 'Guardando...' : 'Guardar Información'}
                    </button>
                </form>
            </div>
        </div>
    );
}
