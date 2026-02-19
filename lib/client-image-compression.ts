/**
 * Compresses and resizes an image file using the browser's Canvas API.
 * 
 * @param file - The original image file
 * @param maxWidth - The maximum width allowed (default: 1920px)
 * @param quality - The JPEG quality from 0 to 1 (default: 0.8)
 * @returns A Promise that resolves to the compressed File object
 */
export async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    // If it's not an image, return original
    if (!file.type.startsWith('image/')) return file;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions (maintain aspect ratio)
                if (width > maxWidth) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file); // Fallback to original
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    // Create new file with same name but maybe updated extension/type if forced
                    // For simplicity, we stick to jpeg for compression or keep original type if supported
                    // Canvas toBlob defaults to png usually if not specified, but we want compression.
                    // Let's force image/jpeg for consistency and size reduction unless it's a transparent png?
                    // Actually, let's try to permit transparency if it's PNG, but usually Hero images are JPEGs.

                    const newFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });

                    // Only return new file if it's actually smaller
                    if (newFile.size < file.size) {
                        resolve(newFile);
                    } else {
                        resolve(file);
                    }
                }, 'image/jpeg', quality);
            };

            img.onerror = (error) => reject(error);
        };

        reader.onerror = (error) => reject(error);
    });
}
