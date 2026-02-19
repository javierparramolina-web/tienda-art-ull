import { put } from '@vercel/blob';

export async function uploadImage(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN is missing. Please connect Vercel Blob store.');
    }

    try {
        const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const blob = await put(filename, file, {
            access: 'public',
        });

        return blob.url;
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        throw error; // Rethrow to see the specific error in the UI/API response
    }
}
