'use client';

import Link from 'next/link';
import Image from 'next/image';
import { updateProduct } from '@/app/actions/product';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; // Still commonly in react-dom in early 19 builds or verify if it moved. 
// Actually package.json says react 19.2.3. useActionState is in react. useFormStatus is in react-dom (or react in newest).
// Let's try importing both from 'react' if possible, or keep useFormStatus in react-dom if not found.
// But the error said: "ReactDOM.useFormState has been renamed to React.useActionState".
// It also said: "ReactDOM.useFormState has been renamed to React.useActionState. Please update SaveButton to use React.useActionState." -> Wait, SaveButton uses useFormStatus?
// Error message 2: "ReactDOM.useFormState has been renamed to React.useActionState. Please update SaveButton to use React.useActionState." -> This might be a typo in my reading or the error message is confusing or I am confusing hooks.
// Check previous log: "ReactDOM.useFormState has been renamed to React.useActionState. Please update EditProductForm..."
// AND "ReactDOM.useFormState has been renamed to React.useActionState. Please update SaveButton..."
// Wait, SaveButton uses `require('react-dom').useFormStatus()`. Maybe `useFormStatus` is ALSO renamed?
// In React 19, `useFormStatus` is in `react-dom` but renamed? No, it's just `useFormStatus`.
// Let's try importing `useActionState` from `react` and `useFormStatus` from `react-dom` (standard) or `react` (new).
// Safest bet for 19: `import { useActionState } from "react"`. `import { useFormStatus } from "react-dom"`.
// If `useFormStatus` warns, we deal with it.

import { Product, Category } from '@prisma/client';
import { Loader2, ArrowLeft, Upload, ImageIcon } from 'lucide-react';
import { useState } from 'react';

// Define initial state for server action
const initialState = { message: '', errors: {} };

interface SerializedProduct extends Omit<Product, 'createdAt' | 'updatedAt'> {
    createdAt: string;
    updatedAt: string;
}

export default function EditProductForm({ product, categories = [] }: { product: SerializedProduct, categories?: Category[] }) {
    // Wrap the update action to pass the ID
    const updateProductWithId = updateProduct.bind(null, product.id);
    const [state, dispatch] = useActionState(updateProductWithId, initialState);

    // Parse existing formats to check boxes
    const [selectedFormats, setSelectedFormats] = useState<{ format: string; price: number }[]>([]);

    useState(() => {
        try {
            const raw = JSON.parse(product.formats);
            if (Array.isArray(raw)) {
                // Check if legacy string[] or new object[]
                const formatted = raw.map(f => {
                    if (typeof f === 'string') return { format: f, price: product.price };
                    return f;
                });
                setSelectedFormats(formatted);
            }
        } catch (e) {
            setSelectedFormats([]);
        }
    });

    // Parse image for preview
    let existingImage = '/placeholder.jpg';
    try {
        const imgs = JSON.parse(product.images);
        if (Array.isArray(imgs) && imgs.length > 0) existingImage = imgs[0];
    } catch (e) { }

    const [imagePreview, setImagePreview] = useState<string | null>(existingImage);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form action={dispatch} className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/admin" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Cancelar
                </Link>
                <h1 className="text-xl font-serif font-light">Editar Producto</h1>
            </div>

            <div className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Título de la Obra
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        defaultValue={product.title}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                    {state.errors?.title && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.title}</p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        defaultValue={product.categoryId || ''}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 bg-white transition-all"
                    >
                        <option value="">Sin Categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        defaultValue={product.description}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                    {state.errors?.description && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.description}</p>
                    )}
                </div>

                {/* Price & Dimensions */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        {/* Hidden price, calculated from variants */}
                    </div>
                    <div>
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                            Ancho (px)
                        </label>
                        <input
                            id="width"
                            name="width"
                            type="number"
                            defaultValue={product.width || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                            Alto (px)
                        </label>
                        <input
                            id="height"
                            name="height"
                            type="number"
                            defaultValue={product.height || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                        />
                    </div>
                </div>

                {/* Formats */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formatos Disponibles</label>
                    <div className="space-y-2">
                        {[
                            { id: 'A4', label: 'A4 (21 x 29.7 cm)' },
                            { id: 'A3', label: 'A3 (29.7 x 42 cm)' },
                            { id: 'A2', label: 'A2 (42 x 59.4 cm)' },
                        ].map((format) => {
                            const isSelected = selectedFormats.some(f => f.format === format.id);
                            const variant = selectedFormats.find(f => f.format === format.id);

                            return (
                                <div key={format.id} className={`flex items-center gap-4 p-3 border rounded-lg transition-colors ${isSelected ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-100'}`}>
                                    <label className="flex items-center gap-3 flex-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedFormats([...selectedFormats, { format: format.id, price: product.price }]);
                                                } else {
                                                    setSelectedFormats(selectedFormats.filter(f => f.format !== format.id));
                                                }
                                            }}
                                            className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                                        />
                                        <span className="text-sm text-gray-700">{format.label}</span>
                                    </label>

                                    {isSelected && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Price:</span>
                                            <input
                                                type="number"
                                                value={variant?.price || ''}
                                                onChange={(e) => {
                                                    const newPrice = parseFloat(e.target.value);
                                                    setSelectedFormats(selectedFormats.map(f =>
                                                        f.format === format.id ? { ...f, price: newPrice } : f
                                                    ));
                                                }}
                                                placeholder="0.00"
                                                step="0.01"
                                                className="w-24 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-brand-blue"
                                                required
                                            />
                                            <span className="text-sm text-gray-500">€</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <input type="hidden" name="formats" value={JSON.stringify(selectedFormats)} />
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de la Obra (Opcional)</label>
                    <div className="flex items-start gap-6">
                        <div className="relative w-32 h-40 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center group">
                            {imagePreview ? (
                                /* Using standard img tag to debug path issues. 
                                   Manually resolving basePath /tienda if needed. 
                                   Next.js Image should handle this but let's be explicit. */
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
                                <Upload className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Cambiar imagen</span>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <p className="mt-2 text-xs text-gray-400">
                                PNG, JPG o WEBP hasta 5MB. Deja vacío para mantener la actual.
                            </p>
                        </div>
                    </div>
                </div>

                {state.message && (
                    <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                        {state.message}
                    </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <SaveButton />
                </div>
            </div>
        </form>
    );
}

function SaveButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-brand-blue text-white px-8 py-3 rounded-full font-medium hover:bg-[#3A5F95] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar Cambios
        </button>
    );
}
