'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const ProductSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().min(0),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    // Checkboxes return multiple values in FormData if checked, handle later.
    // Or simpler: handle string comma separated or JSON.
    formats: z.union([z.string(), z.array(z.string())]).transform((val) =>
        Array.isArray(val) ? val : val.split(',').map((s) => s.trim())
    ),
    categoryId: z.coerce.number().optional(),
});

export async function createProduct(prevState: any, formData: FormData) {
    try {
        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price'),
            width: formData.get('width'),
            height: formData.get('height'),
            formats: formData.getAll('formats').length > 1
                ? formData.getAll('formats')
                : formData.get('formats'),
            categoryId: formData.get('categoryId'),
        };

        const validatedFields = ProductSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Missing Fields. Failed to Create Product.',
            };
        }

        const file = formData.get('image') as File;

        // Dynamic import to avoid build inconsistencies if needed, but let's try direct first or keep dynamic if preferred.
        // Actually, we can use the helper we just made.
        const { uploadImage } = await import('@/lib/upload');
        const imagePath = await uploadImage(file) || '/placeholder.jpg';

        const { title, description, price, width, height, formats, categoryId } = validatedFields.data;

        await prisma.product.create({
            data: {
                title,
                description,
                price,
                width: width || 0,
                height: height || 0,
                formats: JSON.stringify(formats),
                images: JSON.stringify([imagePath]),
                categoryId: categoryId || null,
            },
        });

    } catch (error) {
        console.error('Failed to create product:', error);
        return { message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error') };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    redirect('/admin');
}

export async function deleteProduct(id: number) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/');
        revalidatePath('/admin');
        return { message: 'Deleted Product.' };
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Product.' };
    }
}

export async function updateProduct(id: number, prevState: any, formData: FormData) {
    try {
        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price'),
            width: formData.get('width'),
            height: formData.get('height'),
            formats: formData.getAll('formats').length > 1
                ? formData.getAll('formats')
                : formData.get('formats'),
            categoryId: formData.get('categoryId'),
        };

        const validatedFields = ProductSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Missing Fields. Failed to Update Product.',
            };
        }

        const file = formData.get('image') as File;
        const { uploadImage } = await import('@/lib/upload');
        const imagePath = await uploadImage(file);

        const { title, description, price, width, height, formats, categoryId } = validatedFields.data;

        const updateData: any = {
            title,
            description,
            price,
            width: width || 0,
            height: height || 0,
            formats: JSON.stringify(formats),
            categoryId: categoryId || null,
        };

        if (imagePath) {
            updateData.images = JSON.stringify([imagePath]);
        }

        await prisma.product.update({
            where: { id },
            data: updateData,
        });

    } catch (error) {
        console.error('Failed to update product:', error);
        return { message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error') };
    }

    revalidatePath(`/product/${id}`);
    revalidatePath('/admin');
    redirect('/admin');
}
