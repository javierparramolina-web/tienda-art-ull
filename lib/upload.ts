import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean filename to avoid issues
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}_${cleanName}`;

        // Always save to public/uploads
        const uploadDir = join(process.cwd(), 'public/uploads');
        const fullPath = join(uploadDir, filename);

        console.log('[UPLOAD DEBUG] Saving file to:', fullPath);
        console.log('[UPLOAD DEBUG] process.cwd():', process.cwd());

        await mkdir(uploadDir, { recursive: true });
        await writeFile(fullPath, buffer);

        // Return path relative to base (not including basePath, as Next/Image handles that, 
        // OR if using img tag, must be careful. But we store as /uploads/filename)
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}
