'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Check, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface ProductDetailsProps {
    product: {
        id: number;
        title: string;
        description: string;
        price: number;
        images: string;
        formats: string;
        width: number | null;
        height: number | null;
    };
}

const FORMAT_DETAILS: Record<string, string> = {
    'A2': '42 x 59.4 cm (A2)',
    'A3': '29.7 x 42 cm (A3)',
    'A4': '21 x 29.7 cm (A4)'
};

export default function ProductDetails({ product }: ProductDetailsProps) {
    // Parse data
    const images = JSON.parse(product.images);
    const formats = JSON.parse(product.formats);

    const [selectedFormat, setSelectedFormat] = useState(formats[0] || '');
    const [activeImage, setActiveImage] = useState(images[0] || '/placeholder.jpg');
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20">
            <Link href="/" className="inline-flex items-center text-sm font-light text-gray-400 hover:text-brand-blue mb-12 transition-colors uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la galería
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
                {/* Image Gallery - 7 cols */}
                <div className="lg:col-span-7 space-y-6">
                    <div
                        className="relative aspect-[3/4] w-full bg-gray-50 rounded-2xl overflow-hidden cursor-zoom-in group shadow-sm border border-gray-100"
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                    >
                        {/* Using standard img to avoid basePath issues with local uploads */}
                        <img
                            src={activeImage.startsWith('/') && !activeImage.startsWith('/tienda') ? `/tienda${activeImage}` : activeImage}
                            alt={product.title}
                            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isZoomed ? 'scale-110' : 'scale-100'}`}
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative flex-shrink-0 w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === img ? 'border-brand-blue ring-4 ring-brand-blue/10' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img
                                        src={img.startsWith('/') && !img.startsWith('/tienda') ? `/tienda${img}` : img}
                                        alt={`${product.title} - view ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info - 5 cols */}
                <div className="lg:col-span-5 flex flex-col pt-4">
                    <div className="mb-2">
                        <span className="text-xs uppercase tracking-[0.2em] text-brand-gold font-medium">Original de Art-ULL</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">{product.title}</h1>

                    <div className="flex items-baseline gap-4 mb-8">
                        <p className="text-3xl font-light text-gray-900">{product.price.toFixed(2)} €</p>
                        <span className="text-xs text-brand-blue bg-brand-blue/5 px-2 py-1 rounded uppercase tracking-wider">IVA Incluido</span>
                    </div>

                    <div className="h-px bg-gray-100 w-full mb-8" />

                    <div className="prose prose-gray font-light text-gray-600 mb-10 leading-relaxed text-lg italic">
                        "{product.description}"
                    </div>

                    <div className="space-y-8 mb-12">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-4 font-semibold">Seleccionar Formato</label>
                            <div className="grid grid-cols-1 gap-3">
                                {formats.map((format: string) => (
                                    <button
                                        key={format}
                                        onClick={() => setSelectedFormat(format)}
                                        className={`flex items-center justify-between px-5 py-4 border rounded-xl transition-all duration-300 group ${selectedFormat === format
                                            ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-medium shadow-sm ring-1 ring-brand-blue'
                                            : 'border-gray-100 text-gray-500 hover:border-brand-blue/30 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedFormat === format ? 'border-brand-blue bg-brand-blue' : 'border-gray-300'}`}>
                                                {selectedFormat === format && <Check className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            <span>{FORMAT_DETAILS[format] || format}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto space-y-6">
                        <AddToCartButton product={product} selectedFormat={selectedFormat} />

                        <div className="grid grid-cols-3 gap-4 text-center text-[10px] uppercase tracking-tighter text-gray-400 font-medium">
                            <div className="space-y-1">
                                <div className="h-8 flex items-center justify-center">🌎</div>
                                <p>Envío Nacional</p>
                            </div>
                            <div className="space-y-1">
                                <div className="h-8 flex items-center justify-center">📦</div>
                                <p>Embalaje Seguro</p>
                            </div>
                            <div className="space-y-1">
                                <div className="h-8 flex items-center justify-center">✨</div>
                                <p>Certificado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
