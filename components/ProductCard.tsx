import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    // Parse images JSON safely
    let imageUrl = '/placeholder.jpg';
    try {
        const images = JSON.parse(product.images);
        if (Array.isArray(images) && images.length > 0) {
            imageUrl = images[0];
        }
    } catch (e) {
        console.error("Error parsing product images", e);
    }

    return (
        <Link href={`/product/${product.id}`} className="group block mb-4 break-inside-avoid">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[5/7]">
                {/* Using standard img to avoid basePath issues with local uploads */}
                <img
                    src={imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-[#4A6FA5]/20 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-white font-serif text-lg leading-tight mb-1 truncate">{product.title}</h3>
                    <p className="text-brand-gold text-sm font-medium">{product.price.toFixed(2)} €</p>
                </div>
            </div>
        </Link>
    );
}
