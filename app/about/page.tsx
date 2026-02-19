import { getGlobalSettings } from '@/app/actions/settings';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const settings = await getGlobalSettings();

    // Fallback values
    const title = settings?.aboutTitle || 'Sobre la Artista';
    const description = settings?.aboutDescription || 'La artista no ha añadido una descripción todavía.';
    const image = settings?.aboutImage || '/uploads/about-placeholder.jpg';

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
            <Link href="/" className="inline-flex items-center text-sm font-light text-gray-400 hover:text-black mb-12 transition-colors uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[3/4] w-full bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                    {/* Using standard img for external/blob urls flexibility */}
                    <img
                        src={image}
                        alt="About Artist"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="space-y-6">
                    <div className="mb-2">
                        <span className="text-xs uppercase tracking-[0.2em] text-brand-gold font-medium">Acerca de mí</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">{title}</h1>

                    <div className="h-px bg-gray-100 w-24 mb-8" />

                    <div className="prose prose-gray font-light text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}
