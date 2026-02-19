import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ProductSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().min(0),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    formats: z.union([z.string(), z.array(z.string())]).transform((val) =>
        Array.isArray(val) ? val : val.split(',').map((s) => s.trim())
    ),
    categoryId: z.coerce.number().optional(),
});

export async function POST(request: Request) {
    console.log('[API] Processing POST /api/products');
    try {
        const formData = await request.formData();
        console.log('[API] FormData received');

        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: formData.get('price'),
            width: formData.get('width') || undefined,
            height: formData.get('height') || undefined,
            formats: formData.getAll('formats').length > 1
                ? formData.getAll('formats')
                : formData.get('formats'),
            categoryId: formData.get('categoryId') || undefined,
        };
        console.log('[API] Raw Data:', JSON.stringify(rawData));

        const validatedFields = ProductSchema.safeParse(rawData);

        if (!validatedFields.success) {
            console.error('[API] Validation Error:', validatedFields.error);
            return NextResponse.json(
                {
                    message: 'Missing Fields',
                    errors: validatedFields.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const file = formData.get('image') as File;
        let imagePath = '/placeholder.jpg';

        if (file && file.size > 0) {
            try {
                // Use shared helper for Vercel Blob support
                const { uploadImage } = await import('@/lib/upload');
                const uploadedUrl = await uploadImage(file);
                if (uploadedUrl) {
                    imagePath = uploadedUrl;
                }
            } catch (error) {
                console.error('[API] Error saving file to Blob:', error);
                return NextResponse.json(
                    { message: 'Failed to save image: ' + (error as Error).message },
                    { status: 500 }
                );
            }
        }

        const { title, description, price, width, height, formats, categoryId } = validatedFields.data;

        console.log('[API] Creating DB record...');
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
        console.log('[API] Product created successfully');

        return NextResponse.json({ success: true, message: 'Product created successfully' });

    } catch (error) {
        console.error('[API] CRITICAL ERROR:', error);
        return NextResponse.json(
            {
                message: 'Internal Server Error: ' + (error instanceof Error ? error.message : String(error)),
                debug: String(error)
            },
            { status: 500 }
        );
    }
}
