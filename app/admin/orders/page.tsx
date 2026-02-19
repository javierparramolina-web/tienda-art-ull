import prisma from "@/lib/prisma";
import Link from 'next/link';
import { Eye, Mail, Calendar, Trash2 } from 'lucide-react';
import { deleteOrder, updateOrderStatus } from '@/app/actions/orders';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Pedidos</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">ID</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Fecha</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Cliente</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Estado</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Total</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No hay pedidos todavía.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            {order.id.slice(-8)}...
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.customerName || 'N/A'}</div>
                                            <div className="text-gray-500 flex items-center gap-1 text-xs mt-1">
                                                <Mail className="w-3 h-3" />
                                                {order.customerEmail}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status === 'PAID' ? 'Pagado' :
                                                    order.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            {order.total.toFixed(2)} €
                                        </td>
                                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                            {order.status !== 'COMPLETED' && (
                                                <form action={async () => {
                                                    'use server';
                                                    await updateOrderStatus(order.id, 'COMPLETED');
                                                }}>
                                                    <button
                                                        title="Marcar como Completado"
                                                        className="p-1 px-3 text-xs bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 rounded transition-colors"
                                                    >
                                                        ✓
                                                    </button>
                                                </form>
                                            )}

                                            <form action={async () => {
                                                'use server';
                                                if (confirm('¿Seguro que quieres borrar este pedido?')) {
                                                    await deleteOrder(order.id);
                                                }
                                            }}>
                                                {/* Note: Standard HTML confirm() blocks server action submission in form slightly different in React 19/Next 15 if not prevented, 
                                                    but for simple delete button we might want a client component if we strictly want confirmation dialg. 
                                                    For now, let's just make it a direct delete button to be simple and robust as requested. */}
                                                <button
                                                    type="submit"
                                                    title="Eliminar Pedido"
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-gray-400 hover:text-brand-blue transition-colors flex justify-end"
                                                title="Ver Detalles Completos"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
