'use client';

import { useState } from 'react';

export function HeroSection() {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="relative bg-gray-900 text-white overflow-hidden mb-12 rounded-xl mx-4 mt-4 h-[70vh] flex items-center">
            <div className="absolute inset-0">
                {!imageError ? (
                    <img
                        src="/tienda/uploads/hero-placeholder.jpg"
                        alt="Art Background"
                        className="w-full h-full object-cover opacity-60"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center select-none">
                <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-8">
                    Art-ULL
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light mb-12 leading-relaxed">
                    Ilustraciones que capturan la esencia de lo efímero. <br />
                    Originales y Prints Limitados.
                </p>
                <a
                    href="#gallery"
                    className="px-10 py-4 bg-brand-blue text-white rounded-full font-medium hover:bg-[#3A5F95] transition-all transform hover:scale-105 inline-block shadow-lg"
                >
                    Explorar Colección
                </a>
            </div>
        </div>
    );
}
