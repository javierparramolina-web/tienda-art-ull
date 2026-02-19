import prisma from "@/lib/prisma";
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard, Package } from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/orders';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
    });

    if (!order) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl text-red-500 mb-4">Pedido no encontrado</h1>
                <Link href="/admin/orders" className="text-brand-blue hover:underline">Volver a Pedidos</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Pedidos
                </Link>
                <div className={`px-4 py-1 rounded-full text-sm font-medium ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                    }`}>
                    {order.status === 'PAID' ? 'Pagado' : order.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                </div>
            </div>

            <h1 className="text-3xl font-serif mb-2">Pedido #{order.id.slice(-8)}</h1>
            <p className="text-gray-500 mb-8 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Customer Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        Datos de Envío
                    </h2>
                    <div className="space-y-3 text-gray-700">
                        <p className="font-medium text-lg">{order.customerName || 'Sin Nombre'}</p>
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-gray-400 mt-1" />
                            <a href={`mailto:${order.customerEmail}`} className="hover:text-brand-blue">{order.customerEmail}</a>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-gray-400 mt-1" />
                            <a href={`tel:${order.phone}`} className="hover:text-brand-blue">{order.phone || 'No especificado'}</a>
                        </div>
                        <div className="border-t border-gray-100 my-3 pt-3">
                            <p>{order.address}</p>
                            <p>{order.city} {order.zipCode}</p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-gray-400" />
                        Resumen del Pedido
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-600 mb-4 whitespace-pre-wrap">
                        {order.items}
                    </div>
                    <div className="flex justify-between items-center text-xl font-medium border-t border-gray-200 pt-4">
                        <span>Total</span>
                        <span>{order.total.toFixed(2)} €</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">Acciones del Pedido</span>

                {order.status !== 'COMPLETED' && (
                    <form action={async () => {
                        'use server';
                        await updateOrderStatus(order.id, 'COMPLETED');
                    }}>
                        <button
                            type="submit"
                            className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-[#3A5F95] transition-colors flex items-center gap-2"
                        >
                            Marcar como Completado
                        </button>
                    </form>
                )}
                {order.status === 'COMPLETED' && (
                    <span className="text-green-600 flex items-center gap-2 font-medium">
                        ✓ Pedido Completado
                    </span>
                )}
            </div>
        </div>
    );
}
