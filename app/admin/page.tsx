import prisma from '@/lib/prisma';
import Link from 'next/link';
import { PlusCircle, Trash2, Eye } from 'lucide-react';
import { deleteProduct } from '@/app/actions/product';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-light">Panel de Control</h1>
                <Link
                    href="/admin/new"
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#3A5F95] transition-colors"
                >
                    <PlusCircle className="w-4 h-4" />
                    Nuevo Producto
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                            <th className="px-6 py-4">Título</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Formatos</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No hay productos todavía.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{product.title}</td>
                                    <td className="px-6 py-4">{product.price} €</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {/* Basic parse display */}
                                        {product.formats.replace(/[\[\]"]/g, ' ')}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                                        <Link
                                            href={`/product/${product.id}`}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Ver"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </Link>

                                        <Link
                                            href={`/admin/edit/${product.id}`}
                                            className="text-gray-400 hover:text-brand-gold transition-colors"
                                            title="Editar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </Link>

                                        <form action={async () => {
                                            'use server';
                                            await deleteProduct(product.id);
                                        }}>
                                            <button
                                                type="submit"
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
