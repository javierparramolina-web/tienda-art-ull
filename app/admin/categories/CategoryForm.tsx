'use client';

import { useActionState } from 'react';
import { createCategory } from '@/app/actions/category';
import { Loader2 } from 'lucide-react';

const initialState = {
    message: '',
    errors: undefined,
};

export default function CategoryForm() {
    const [state, formAction, isPending] = useActionState(createCategory, initialState);

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Nueva Categoría</h2>
            <form action={formAction} className="space-y-4">
                {state?.message && (
                    <div className={`p-3 text-sm rounded-md ${state.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {state.message}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                        name="name"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="Ej. Paisajes"
                    />
                    {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex justify-center items-center"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Categoría'}
                </button>
            </form>
        </div>
    );
}
