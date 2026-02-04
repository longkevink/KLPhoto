type CloudinaryFormat = 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
type CloudinaryCrop = 'limit' | 'fill';

interface CloudinaryUrlOptions {
    width?: number;
    height?: number;
    maxDimension?: number;
    quality?: 'auto' | number;
    format?: CloudinaryFormat;
    crop?: CloudinaryCrop;
}

export const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();

export function getCloudinaryFallbackUrl(width = 800, height = 600): string {
    return `https://via.placeholder.com/${width}x${height}?text=Cloudinary+Config+Missing`;
}

export function getCloudinaryUrl(publicId: string, options: CloudinaryUrlOptions = {}): string {
    if (!cloudinaryCloudName) {
        return getCloudinaryFallbackUrl(options.width, options.height);
    }

    const transformations: string[] = [];

    const maxDimension = options.maxDimension;
    let width = options.width;
    let height = options.height;

    if (maxDimension) {
        if (width && width > maxDimension) width = maxDimension;
        if (height && height > maxDimension) height = maxDimension;
    }

    if (width) transformations.push(`w_${Math.round(width)}`);
    if (height) transformations.push(`h_${Math.round(height)}`);
    if (width || height) transformations.push(`c_${options.crop ?? 'limit'}`);

    transformations.push(`q_${options.quality ?? 'auto'}`);
    transformations.push(`f_${options.format ?? 'auto'}`);

    return `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${transformations.join(',')}/${publicId}`;
}
