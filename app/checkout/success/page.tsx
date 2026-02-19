'use client';

import { useCartStore } from '@/store/cart';
import { CheckCircle, AlertCircle, Loader2, Printer, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Separate component to handle search params in Suspense
function SuccessContent() {
    const { clearCart } = useCartStore();
    const searchParams = useSearchParams();
    const paymentIntentId = searchParams.get('payment_intent');
    const orderIdParam = searchParams.get('orderId');

    // Order state
    const [order, setOrder] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        // If we already loaded the order, don't do anything
        if (order) return;

        const processOrder = async () => {
            try {
                let idToFetch = orderIdParam;

                // Scenario A: Stripe Return (has payment_intent)
                if (paymentIntentId) {
                    // Confirm and create order if needed
                    const confirmRes = await fetch('/tienda/api/orders/confirm', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentIntentId }),
                    });

                    if (!confirmRes.ok) throw new Error('Payment confirmation failed');

                    const confirmData = await confirmRes.json();
                    idToFetch = confirmData.orderId;

                    // Clear cart only on successful Stripe confirmation
                    clearCart();
                }
                // Scenario B: Bizum Return (has orderId)
                else if (orderIdParam) {
                    // Cart is cleared in CheckoutForm for Bizum, but verified here
                    // No extra confirmation step needed for display
                } else {
                    throw new Error('No order identifier found');
                }

                // Fetch full order details
                const orderRes = await fetch(`/tienda/api/orders/${idToFetch}`);
                if (!orderRes.ok) throw new Error('Failed to fetch order details');

                const orderData = await orderRes.json();
                setOrder(orderData);
                setStatus('success');

            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };

        processOrder();
    }, [paymentIntentId, orderIdParam, clearCart, order]);

    if (status === 'loading') {
        return (
            <div className="text-center">
                <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Procesando tu recibo...</p>
            </div>
        );
    }

    if (status === 'error' || !order) {
        return (
            <div className="text-center max-w-md px-4">
                <div className="flex justify-center mb-6">
                    <AlertCircle className="w-20 h-20 text-red-500" />
                </div>
                <h1 className="text-3xl font-serif mb-4">No pudimos cargar el pedido</h1>
                <p className="text-gray-500 mb-8">
                    Si te han cobrado, no te preocupes. Contáctanos y lo solucionamos.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-brand-blue text-white px-8 py-3 rounded-full hover:bg-[#3A5F95] transition-colors"
                >
                    Volver al Inicio
                </Link>
            </div>
        );
    }

    // Parse items if they are JSON string
    let parsedItems = [];
    try {
        parsedItems = JSON.parse(order.items);
    } catch (e) {
        console.warn('Could not parse items JSON, using raw string');
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto print:shadow-none print:border-none">

                {/* Header */}
                <div className="text-center border-b border-gray-100 pb-8 mb-8">
                    <div className="flex justify-center mb-4 print:hidden">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-serif mb-2">¡Pedido Confirmado!</h1>
                    <p className="text-gray-500">Gracias por tu compra.</p>
                    <div className="mt-4 text-sm text-gray-400">
                        ID: <span className="font-mono">{order.id}</span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Customer Info */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Envío
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-black">{order.customerName}</p>
                            <p>{order.address}</p>
                            <p>{order.zipCode} {order.city}</p>
                            {order.phone && (
                                <p className="flex items-center gap-2 mt-2">
                                    <Phone className="w-3 h-3" /> {order.phone}
                                </p>
                            )}
                            <p className="flex items-center gap-2">
                                <Mail className="w-3 h-3" /> {order.customerEmail}
                            </p>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Detalles
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex justify-between">
                                <span>Fecha:</span>
                                <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estado:</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.status === 'PAID' ? 'Pagado' : 'Pendiente Pago'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Método:</span>
                                <span className="font-medium">
                                    {paymentIntentId ? 'Tarjeta' : 'Bizum / Transferencia'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden mb-8">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Producto</th>
                                <th className="px-4 py-3 text-right">Precio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {Array.isArray(parsedItems) ? (
                                parsedItems.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-gray-500 text-xs">{item.format} x{item.quantity}</div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {(item.price * (item.quantity || 1)).toFixed(2)} €
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-4 py-3 text-gray-500 italic">
                                        {order.items}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-gray-50 font-medium">
                            <tr>
                                <td className="px-4 py-3 text-right">Total</td>
                                <td className="px-4 py-3 text-right text-lg">{order.total.toFixed(2)} €</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <Printer className="w-4 h-4" /> Imprimir Recibo
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Volver a la Tienda
                    </Link>
                </div>

                <div className="text-center mt-8 text-xs text-gray-400 print:block hidden">
                    <p>Art-ULL - Ilustraciones Originales</p>
                    <p>{window.location.origin}</p>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <Suspense fallback={
                <div className="text-center pt-20">
                    <Loader2 className="w-16 h-16 animate-spin mx-auto text-gray-300" />
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
