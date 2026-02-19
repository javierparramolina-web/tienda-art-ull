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
    // Formats is now a JSON string containing [{format: string, price: number}]
    formats: z.string().transform((val) => {
        try {
            return JSON.parse(val);
        } catch {
            return [];
        }
    }),
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
            // Price is derived from the lowest format price
            price: 0, // Placeholder, will be calculated
            width: formData.get('width') || undefined,
            height: formData.get('height') || undefined,
            formats: formData.get('formats'),
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

        // Calculate min price for display
        const minPrice = Array.isArray(formats) && formats.length > 0
            ? Math.min(...formats.map((f: any) => Number(f.price) || 0))
            : 0;

        console.log('[API] Creating DB record...');
        await prisma.product.create({
            data: {
                title,
                description,
                price: minPrice,
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
