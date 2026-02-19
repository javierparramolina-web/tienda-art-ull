import { getGlobalSettings } from '@/app/actions/settings';
import { SettingsForm } from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const settings = await getGlobalSettings();
    const currentHeroImage = settings?.heroImage || '/uploads/hero-placeholder.jpg';

    const aboutSettings = {
        title: settings?.aboutTitle || 'Sobre la Artista',
        description: settings?.aboutDescription || '',
        image: settings?.aboutImage || null
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-serif mb-8">Configuración Global</h1>
            <SettingsForm
                currentHeroImage={currentHeroImage}
                aboutSettings={aboutSettings}
            />
        </div>
    );
}
