import prisma from '@/lib/prisma';
import { deleteCategory } from '@/app/actions/category';
import CategoryForm from './CategoryForm';
import { Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true } } }
    });

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-serif font-light mb-8">Gestión de Categorías</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Create Form */}
                <div>
                    <CategoryForm />
                </div>

                {/* List */}
                <div>
                    <h2 className="text-lg font-medium mb-4">Categorías Existentes</h2>
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {categories.length === 0 ? (
                                <li className="p-4 text-center text-gray-500 text-sm">No hay categorías.</li>
                            ) : (
                                categories.map((cat) => (
                                    <li key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                        <div>
                                            <span className="font-medium text-gray-900">{cat.name}</span>
                                            <span className="ml-2 text-xs text-gray-500">({cat._count.products} productos)</span>
                                        </div>

                                        <form action={async () => {
                                            'use server';
                                            await deleteCategory(cat.id);
                                        }}>
                                            <button
                                                type="submit"
                                                disabled={cat._count.products > 0}
                                                className="text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                                                title={cat._count.products > 0 ? "No se puede eliminar categorías con productos" : "Eliminar"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
