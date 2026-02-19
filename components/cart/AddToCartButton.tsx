'use client';

import { useCartStore } from '@/store/cart';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
    product: {
        id: number;
        title: string;
        price: number;
        images: string;
    };
    selectedFormat: string;
}

export default function AddToCartButton({ product, selectedFormat }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = () => {
        setIsAdding(true);

        // Parse images to get the first one
        const images = JSON.parse(product.images);
        const image = images[0] || '/placeholder.jpg';

        addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            image,
            format: selectedFormat,
            quantity: 1,
        });

        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 bg-brand-blue text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[#3A5F95] transition-all flex items-center justify-center gap-3 disabled:scale-95 disabled:opacity-90"
        >
            <ShoppingBag className="w-5 h-5" />
            {isAdding ? 'Añadido' : 'Añadir a la bolsa'}
        </button>
    );
}
