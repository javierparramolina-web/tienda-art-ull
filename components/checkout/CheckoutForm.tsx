'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { CreditCard, Wallet, Loader2 } from 'lucide-react';

export default function CheckoutForm({ amount }: { amount: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const { items, clearCart } = useCartStore();

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bizum'>('card');
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const emailInput = document.getElementById('email') as HTMLInputElement;
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const phoneInput = document.getElementById('phone') as HTMLInputElement;
        const addressInput = document.getElementById('address') as HTMLInputElement;
        const cityInput = document.getElementById('city') as HTMLInputElement;
        const zipInput = document.getElementById('zip') as HTMLInputElement;

        const customerEmail = emailInput?.value;
        const customerName = nameInput?.value;
        const phone = phoneInput?.value;
        const address = addressInput?.value;
        const city = cityInput?.value;
        const zipCode = zipInput?.value;

        if (!customerEmail || !customerName || !address || !city || !zipCode) {
            setMessage("Por favor, completa todos los campos.");
            setIsLoading(false);
            return;
        }

        const shippingDetails = {
            customerName,
            customerEmail,
            phone,
            address,
            city,
            zipCode
        };

        if (paymentMethod === 'bizum') {
            try {
                const response = await fetch('/api/orders/bizum', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: items.map(item => ({
                            ...item,
                            id: Number(item.productId), // Send productId as the ID expected by schema/DB logic for now
                        })),
                        total: amount,
                        email: customerEmail, // Explicitly set email to match Zod schema
                        ...shippingDetails
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    clearCart();
                    window.location.href = `/checkout/success?orderId=${data.orderId}`;
                } else {
                    setMessage(data.message || "Error al procesar la solicitud.");
                }
            } catch (error) {
                setMessage("Ha ocurrido un error inesperado. Inténtalo de nuevo.");
            }
            setIsLoading(false);
            return;
        }

        // Stripe Logic
        if (!stripe || !elements) {
            setIsLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
                receipt_email: customerEmail,
                payment_method_data: {
                    billing_details: {
                        name: customerName,
                        email: customerEmail,
                        phone: phone,
                        address: {
                            line1: address,
                            city: city,
                            postal_code: zipCode,
                        },
                    },
                },
                shipping: {
                    name: customerName,
                    address: {
                        line1: address,
                        city: city,
                        postal_code: zipCode,
                    },
                    phone: phone,
                }
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card'
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                        : 'border-gray-100 hover:border-gray-200 text-gray-500'
                        }`}
                >
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">Tarjeta</span>
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMethod('bizum')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'bizum'
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                        : 'border-gray-100 hover:border-gray-200 text-gray-500'
                        }`}
                >
                    <Wallet className="w-6 h-6 mb-2" />
                    <span className="font-medium text-sm">Bizum / Transf.</span>
                </button>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Datos de Envío</h3>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input id="name" type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-sans" />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                    <input id="email" type="email" required placeholder="tu@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-sans" />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input id="phone" type="tel" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-sans" />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección Postal</label>
                    <input id="address" type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-sans" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                        <input id="city" type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-sans" />
                    </div>
                    <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                        <input id="zip" type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-sans" />
                    </div>
                </div>
            </div>

            {paymentMethod === 'card' ? (
                <div className="animate-in fade-in duration-300">
                    <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
                </div>
            ) : (
                <div className="bg-brand-gold/10 p-6 rounded-xl border border-brand-gold/20 animate-in fade-in duration-300">
                    <h3 className="font-serif text-lg font-medium text-gray-900 mb-2">Pago Manual</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Al confirmar el pedido, recibirás un correo con las instrucciones para completar el pago mediante <strong>Bizum</strong> o <strong>Transferencia Bancaria</strong>.
                    </p>
                    <p className="text-xs text-gray-500 mt-4 italic">
                        Tu pedido quedará reservado durante 24h hasta recibir el pago.
                    </p>
                </div>
            )}

            {message && (
                <div id="payment-message" className="text-red-500 text-sm bg-red-50 p-4 rounded-lg flex items-center gap-2">
                    <span>⚠️</span> {message}
                </div>
            )}

            <button
                disabled={isLoading || (paymentMethod === 'card' && (!stripe || !elements))}
                id="submit"
                className="w-full bg-brand-blue text-white py-4 rounded-full font-medium text-lg hover:bg-[#3A5F95] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Procesando...
                    </>
                ) : (
                    <span>
                        {paymentMethod === 'card' ? `Pagar ${amount.toFixed(2)} €` : 'Confirmar Pedido'}
                    </span>
                )}
            </button>

            <p className="text-xs text-center text-gray-400">
                {paymentMethod === 'card'
                    ? 'Pagos procesados de forma segura por Stripe.'
                    : 'Gestionado directamente por Art-ULL.'
                }
            </p>
        </form>
    );
}
