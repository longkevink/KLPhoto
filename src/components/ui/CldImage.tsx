'use client';

import Image, { ImageProps } from 'next/image';
import { getCloudinaryUrl } from '@/lib/cloudinary';

/**
 * A resilient drop-in replacement for next-cloudinary's CldImage.
 * Uses our internal utility to build URLs, which prevents build-time crashes
 * if the Cloudinary cloud name is missing.
 */
interface CldImageProps extends Omit<ImageProps, 'src'> {
    src: string; // The Cloudinary public ID
    tint?: string;
    // Add other CldImage props if needed in the future
}

export default function CldImage({
    src,
    width,
    height,
    alt,
    className,
    unoptimized,
    ...props
}: CldImageProps) {
    // Serve original asset URL for maximum source resolution.
    const cloudinaryUrl = getCloudinaryUrl(src);

    return (
        <Image
            src={cloudinaryUrl}
            width={width}
            height={height}
            alt={alt}
            className={className}
            unoptimized={unoptimized ?? true}
            {...props}
        />
    );
}
