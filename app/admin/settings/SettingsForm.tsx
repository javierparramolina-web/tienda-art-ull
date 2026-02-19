import { updateSettingsWithUrl } from '@/app/actions/settings';
import { upload } from '@vercel/blob/client';
import { compressImage } from '@/lib/client-image-compression';

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
    const [uploading, setUploading] = useState(false);

    // We use a generic action handler for the text status
    const [status, setStatus] = useState<{ message: string; success: boolean } | null>(null);

    async function handleHeroSubmit(formData: FormData) {
        setUploading(true);
        setStatus(null);

        try {
            const file = formData.get('heroImage') as File;
            let finalUrl = currentHeroImage;

            if (file && file.size > 0) {
                // Compress image before upload (Client-side)
                const compressedFile = await compressImage(file, 1920, 0.8);

                const newBlob = await upload(compressedFile.name, compressedFile, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                finalUrl = newBlob.url;
            } else {
                setUploading(false);
                return; // Nothing to do if no file
            }

            // Call server action with URL
            const result = await updateSettingsWithUrl('heroImage', finalUrl);
            setStatus(result);
        } catch (error) {
            console.error(error);
            setStatus({ message: 'Error al subir la imagen. Intenta con una más pequeña o verifica tu conexión.', success: false });
        } finally {
            setUploading(false);
        }
    }

    async function handleAboutSubmit(formData: FormData) {
        setUploading(true);
        setStatus(null);

        try {
            const title = formData.get('aboutTitle') as string;
            const description = formData.get('aboutDescription') as string;
            const file = formData.get('aboutImage') as File;

            let imageUrl = aboutSettings?.image;

            if (file && file.size > 0) {
                const compressedFile = await compressImage(file, 800, 0.8); // Smaller storage for profile pics
                const newBlob = await upload(compressedFile.name, compressedFile, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                imageUrl = newBlob.url;
            }

            // We construct a simplified object to pass to server action
            const result = await updateSettingsWithUrl('about', {
                title,
                description,
                imageUrl
            });
            setStatus(result);

        } catch (error) {
            console.error(error);
            setStatus({ message: 'Error al guardar los cambios.', success: false });
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="space-y-8">
            {/* Status Message */}
            {status && (
                <div className={`fixed top-24 right-4 z-50 p-4 rounded-xl shadow-lg border ${status.success ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'} transition-all`}>
                    {status.message}
                </div>
            )}

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

                <form action={handleHeroSubmit} className="space-y-4">
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
                        disabled={uploading}
                        className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-[#3A5F95] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <span className="animate-spin">⏳</span> Subiendo...
                            </>
                        ) : 'Guardar Cambios'}
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                        * Se recomienda una imagen horizontal de alta calidad.
                        La imagen se optimizará automáticamente al subirla.
                    </p>
                </form>
            </div>

            {/* About Me Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium mb-6">Página "Acerca de Mí"</h2>

                <form action={handleAboutSubmit} className="space-y-6">
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

                    <button
                        type="submit"
                        disabled={uploading}
                        className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-[#3A5F95] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <span className="animate-spin">⏳</span> Guardando...
                            </>
                        ) : 'Guardar Información'}
                    </button>
                </form>
            </div>
        </div>
    );
}
