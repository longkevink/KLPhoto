/**
 * Cloudinary utility functions for server-side operations.
 * Configuration is automatically read from CLOUDINARY_URL env var.
 *
 * For client-side image display, use <CldImage /> from 'next-cloudinary'.
 */

/**
 * Helper to build a Cloudinary URL for a given public ID.
 * Useful when you need a raw URL instead of the CldImage component.
 */
export function getCloudinaryUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
        // Log warning but don't throw during build to prevent crash
        console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured. Falling back to placeholder.');
        return `https://via.placeholder.com/${options?.width || 800}x${options?.height || 600}?text=Cloudinary+Config+Missing`;
    }

    const transformations: string[] = [];

    if (options?.width) transformations.push(`w_${options.width}`);
    if (options?.height) transformations.push(`h_${options.height}`);
    if (options?.quality) transformations.push(`q_${options.quality}`);
    if (options?.format) transformations.push(`f_${options.format}`);

    const transformString = transformations.length > 0
        ? `${transformations.join(',')}/`
        : '';

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
}

/**
 * Cloudinary cloud name for use in components.
 * This is safe to use in client components.
 */
export const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
