'use client';

import { useCartStore } from '@/store/cart';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartSheet() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();
    const [hydrated, setHydrated] = useState(false);

    // Handle hydration mismatch
    useEffect(() => {
        useCartStore.persist.rehydrate();
        setHydrated(true);
    }, []);

    if (!hydrated) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-serif">Tu Compra ({items.length})</h2>
                        <button
                            onClick={closeCart}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <p className="text-gray-500">Tu bolsa está vacía.</p>
                                <button
                                    onClick={closeCart}
                                    className="text-black underline font-medium hover:text-gray-600"
                                >
                                    Seguir mirando
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        {/* Using standard img for cart items to avoid path issues */}
                                        <img
                                            src={item.image.startsWith('/') && !item.image.startsWith('/tienda') ? `/tienda${item.image}` : item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                                            <p className="text-sm text-gray-500">{item.format}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-3 border border-gray-200 rounded-md p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-gray-50 rounded"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-50 rounded"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 self-start"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-between items-center mb-4 text-lg font-medium">
                                <span>Total</span>
                                <span>{getTotal().toFixed(2)} €</span>
                            </div>
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="block w-full bg-brand-blue text-white text-center py-3 rounded-lg font-medium hover:bg-[#3A5F95] transition-colors"
                            >
                                Tramitar Pedido
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
