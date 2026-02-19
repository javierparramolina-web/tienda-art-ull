'use client';

import { useCartStore } from '@/store/cart';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartIcon() {
    const { items, toggleCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    if (!mounted) {
        return (
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
            </button>
        )
    }

    return (
        <button
            onClick={toggleCart}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
        >
            <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {count}
                </span>
            )}
        </button>
    );
}
