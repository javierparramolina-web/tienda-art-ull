'use server';

// Re-export existing actions for clarity, though not strictly needed
export { createProduct, deleteProduct } from '@/app/actions/product';

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

        // Handle Image Upload (Optional)
        const file = formData.get('image') as File;
        let imagePath = undefined;

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;

            // Dynamic imports to avoid bundling issues
            const fs = await import('fs/promises');
            const path = await import('path');

            const uploadDir = path.join(process.cwd(), 'public/uploads');

            try {
                await fs.mkdir(uploadDir, { recursive: true });
                await fs.writeFile(path.join(uploadDir, filename), buffer);
                imagePath = `/uploads/${filename}`;
            } catch (error) {
                console.error('Error saving file:', error);
                return { message: 'Failed to save image.' };
            }
        }

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
        return { message: 'Database Error: Failed to Update Product.' };
    }

    revalidatePath(`/product/${id}`);
    revalidatePath('/admin');
    redirect('/admin');
}
