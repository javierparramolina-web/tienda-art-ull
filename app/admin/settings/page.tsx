'use server';

import { getGlobalSettings, updateHeroImage, updateAboutSettings } from '@/app/actions/settings';
// import { Button } from '@/components/ui/button'; // Assuming button exists or standard html button
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    // Check auth? Middleware handles /admin/* usually.

    const settings = await getGlobalSettings();
    const currentHeroImage = settings?.heroImage || '/uploads/hero-placeholder.jpg';

    async function handleUpdate(formData: FormData) {
        'use server';
        await updateHeroImage(formData);
        redirect('/admin/settings');
    }

    async function handleUpdateAbout(formData: FormData) {
        'use server';
        await updateAboutSettings(formData);
        redirect('/admin/settings');
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-serif mb-8">Configuración Global</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
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

                <form action={handleUpdate} className="space-y-4">
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
                    <button
                        type="submit"
                        className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-[#3A5F95] transition-colors"
                    >
                        Guardar Cambios
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                        * Se recomienda una imagen horizontal de alta calidad (min 1920x1080).
                    </p>
                </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-medium mb-6">Página "Acerca de Mí"</h2>

                <form action={handleUpdateAbout} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            type="text"
                            name="aboutTitle"
                            defaultValue={settings?.aboutTitle || 'Sobre la Artista'}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="aboutDescription"
                            rows={6}
                            defaultValue={settings?.aboutDescription || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de Perfil</label>
                        {settings?.aboutImage && (
                            <div className="mb-4 w-32 h-32 relative rounded-full overflow-hidden bg-gray-100">
                                <img src={settings.aboutImage} alt="About" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <input
                            type="file"
                            name="aboutImage"
                            accept="image/*"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20"
                        />
                    </div>

                    <button type="submit" className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-[#3A5F95] transition-colors">
                        Guardar Información
                    </button>
                </form>
            </div>
        </div>
    );
}
