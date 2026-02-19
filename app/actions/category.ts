'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CategorySchema = z.object({
    name: z.string().min(1, "El nombre no puede estar vacío"),
});

export async function createCategory(prevState: any, formData: FormData) {
    try {
        const rawData = {
            name: formData.get('name'),
        };

        const validatedFields = CategorySchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Error de validación.',
            };
        }

        await prisma.category.create({
            data: {
                name: validatedFields.data.name,
            },
        });

        revalidatePath('/admin/categories');
        return { message: 'Categoría creada', success: true };

    } catch (error) {
        console.error('Failed to create category:', error);
        // @ts-ignore
        if (error.code === 'P2002') {
            return { message: 'Ya existe una categoría con este nombre.' };
        }
        return { message: 'Error al crear la categoría.' };
    }
}

export async function deleteCategory(id: number) {
    try {
        // Check if category has products
        const category = await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } }
        });

        if (category && category._count.products > 0) {
            return { message: 'No se puede eliminar: Hay productos asociados.' };
        }

        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categories');
        return { message: 'Categoría eliminada.' };
    } catch (error) {
        return { message: 'Error al eliminar la categoría.' };
    }
}
