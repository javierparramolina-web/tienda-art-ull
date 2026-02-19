'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getGlobalSettings() {
    try {
        const settings = await prisma.globalSettings.findFirst();
        return settings;
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
    }
}

export async function updateHeroImage(formData: FormData) {
    try {
        const file = formData.get('heroImage') as File;

        if (!file || file.size === 0) {
            return { message: 'No image provided.' };
        }

        const { uploadImage } = await import('@/lib/upload');
        let imageUrl;
        try {
            imageUrl = await uploadImage(file);
        } catch (e: any) {
            if (e.message?.includes('BLOB_READ_WRITE_TOKEN')) {
                return { message: 'Error: Configuración incompleta. Falta el token de Vercel Blob.' };
            }
            throw e;
        }

        if (!imageUrl) {
            return { message: 'Failed to upload image.' };
        }

        // Upsert: Create if not exists, update if exists (always id: 1 or take first)
        const existing = await prisma.globalSettings.findFirst();

        if (existing) {
            await prisma.globalSettings.update({
                where: { id: existing.id },
                data: { heroImage: imageUrl },
            });
        } else {
            await prisma.globalSettings.create({
                data: { heroImage: imageUrl },
            });
        }

        revalidatePath('/');
        return { success: true, message: 'Hero image updated successfully!' };

    } catch (error) {
        console.error('Failed to update hero image:', error);
        return { message: 'Error updating settings.' };
    }
}

export async function updateAboutSettings(formData: FormData) {
    try {
        const title = formData.get('aboutTitle') as string;
        const description = formData.get('aboutDescription') as string;
        const file = formData.get('aboutImage') as File;

        let imageUrl = undefined;
        if (file && file.size > 0) {
            const { uploadImage } = await import('@/lib/upload');
            try {
                imageUrl = await uploadImage(file);
            } catch (e: any) {
                if (e.message?.includes('BLOB_READ_WRITE_TOKEN')) {
                    return { message: 'Error: Falta configurar el almacenamiento (Vercel Blob).' };
                }
                throw e;
            }
        }

        const existing = await prisma.globalSettings.findFirst();

        if (existing) {
            await prisma.globalSettings.update({
                where: { id: existing.id },
                data: {
                    aboutTitle: title,
                    aboutDescription: description,
                    ...(imageUrl && { aboutImage: imageUrl }),
                },
            });
        } else {
            await prisma.globalSettings.create({
                data: {
                    aboutTitle: title,
                    aboutDescription: description,
                    aboutImage: imageUrl,
                },
            });
        }

        revalidatePath('/about');
        return { success: true, message: 'About page updated successfully!' };
    } catch (error) {
        console.error('Failed to update about settings:', error);
        return { message: 'Error updating about settings.' };
    }
}
