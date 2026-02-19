'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface NewProductFormProps {
    categories: { id: number; name: string }[];
}

type FormState = {
    message: string;
    errors?: {
        [key: string]: string[];
    };
    success?: boolean;
};

export default function NewProductForm({ categories }: NewProductFormProps) {
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState<FormState>({ message: '' });
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            try {
                // Must include basePath '/tienda' manually for fetch
                const response = await fetch('/api/products', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                    setState({
                        message: result.message || 'Error al crear producto',
                        errors: result.errors
                    });
                    return;
                }

                setState({ message: 'Producto creado correctamente', success: true });
                // Optional: Redirect or clear form
                window.location.href = '/admin';
            } catch (error) {
                console.error(error);
                setState({ message: 'Error de red al crear el producto' });
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/admin" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Volver al panel
                </Link>
                <h1 className="text-3xl font-serif font-light">Nuevo Producto</h1>
                <p className="text-gray-500">Sube una nueva ilustración a la tienda.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg border border-gray-100 shadow-sm">

                {state?.message && (
                    <div className={`p-4 text-sm rounded-md ${state.errors ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {state.message}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            name="title"
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            placeholder="Ej. Atardecer en Anaga"
                        />
                        {state?.errors?.title && <p className="text-red-500 text-xs mt-1">{state.errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            placeholder="Descripción de la obra..."
                        />
                        {state?.errors?.description && <p className="text-red-500 text-xs mt-1">{state.errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                                name="categoryId"
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all bg-white"
                            >
                                <option value="">Sin Categoría</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Formatos Disponibles</label>
                            <div className="space-y-2">
                                {[
                                    { id: 'A2', label: 'A2 (42 x 59.4 cm)' },
                                    { id: 'A3', label: 'A3 (29.7 x 42 cm)' },
                                    { id: 'A4', label: 'A4 (21 x 29.7 cm)' },
                                ].map((format) => (
                                    <label key={format.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="formats"
                                            value={format.id}
                                            defaultChecked={format.id !== 'A2'}
                                            className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                                        />
                                        <span className="text-sm text-gray-700">{format.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (px) - Opcional</label>
                            <input
                                name="width"
                                type="number"
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alto (px) - Opcional</label>
                            <input
                                name="height"
                                type="number"
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-200 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar Producto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
