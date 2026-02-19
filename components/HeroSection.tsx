import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getGlobalSettings } from '@/app/actions/settings';

export default async function HeroSection() {
    const settings = await getGlobalSettings();
    const heroImage = settings?.heroImage || '/uploads/hero-placeholder.jpg';

    return (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Art Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/90" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000">
                <h1 className="text-6xl md:text-8xl font-serif text-gray-900 mb-6 tracking-tight">
                    Art <span className="text-brand-blue italic">ULL</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                    Ilustraciones que capturan la esencia de lo cotidiano.
                    <br />
                    <span className="text-base text-gray-500 mt-2 block">Obras originales y láminas exclusivas.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="#gallery"
                        className="group bg-black text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-brand-blue transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Ver Colección
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/about"
                        className="bg-white/80 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-full font-medium text-lg hover:bg-white transition-all duration-300 border border-white/50 shadow-sm hover:shadow-md"
                    >
                        Sobre la Artista
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-gray-400 rounded-full" />
                </div>
            </div>
        </section>
    );
}
