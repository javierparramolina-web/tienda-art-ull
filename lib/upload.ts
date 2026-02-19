import { put } from '@vercel/blob';

export async function uploadImage(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    try {
        const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const blob = await put(filename, file, {
            access: 'public',
        });

        return blob.url;
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        throw new Error('Failed to upload image');
    }
}
