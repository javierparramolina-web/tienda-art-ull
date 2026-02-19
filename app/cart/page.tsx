'use client';

import { useCartStore } from '@/store/cart';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';


export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        useCartStore.persist.rehydrate();
        setHydrated(true);
    }, []);

    if (!hydrated) return <div className="min-h-screen bg-white pt-32 px-4 container mx-auto" />;

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-serif mb-8">Tu Compra</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-xl text-gray-500 mb-6 font-light">Tu bolsa está vacía.</p>
                        <Link href="/" className="inline-block bg-brand-blue text-white px-8 py-3 rounded-full hover:bg-[#3A5F95] transition-colors">
                            Volver a la tienda
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Items List */}
                        <div className="md:col-span-2 space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-6 py-6 border-b border-gray-100">
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-medium font-serif">{item.title}</h3>
                                            <p className="font-medium text-lg">{(item.price * item.quantity).toFixed(2)} €</p>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-4">{item.format}</p>

                                        <div className="flex justify-between items-end mt-auto">
                                            <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-1 border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:text-black text-gray-500"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:text-black text-gray-500"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="md:col-span-1">
                            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                                <h2 className="text-xl font-serif mb-6">Resumen</h2>
                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{getTotal().toFixed(2)} €</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span>Gratis</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex justify-between font-medium text-lg">
                                        <span>Total</span>
                                        <span>{getTotal().toFixed(2)} €</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-brand-blue text-white py-4 rounded-lg font-medium hover:bg-[#3A5F95] transition-all flex items-center justify-center gap-2 group"
                                >
                                    Tramitar Pedido
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-xs text-center text-gray-400 mt-4">
                                    Pago seguro con Stripe
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
