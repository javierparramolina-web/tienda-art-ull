'use client';

import { useCartStore } from '@/store/cart';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Link from 'next/link';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const { items, getTotal } = useCartStore();
    const [clientSecret, setClientSecret] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        useCartStore.persist.rehydrate();
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            // Create PaymentIntent as soon as the page loads
            // Must include basePath '/tienda'
            fetch("/tienda/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setClientSecret(data.clientSecret);
                    setAmount(data.amount);
                });
        }
    }, [items]);

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#000000',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    if (!hydrated) return null;

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-serif mb-8 text-center">Finalizar Compra</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-xl text-gray-500 mb-6 font-light">Tu bolsa está vacía.</p>
                        <Link href="/" className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
                            Volver a la tienda
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Order Summary */}
                        <div className="bg-gray-50 p-8 rounded-xl h-fit">
                            <h2 className="text-xl font-serif mb-6">Tu Pedido</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.title} <span className="text-gray-500">x{item.quantity}</span></span>
                                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 pt-4 flex justify-between font-medium text-lg mt-4">
                                    <span>Total a Pagar</span>
                                    <span>{getTotal().toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="bg-white">
                            {clientSecret && stripePromise && (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm amount={amount} />
                                </Elements>
                            )}
                            {!clientSecret && (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
