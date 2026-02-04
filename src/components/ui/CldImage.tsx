'use client';

import Image, { ImageLoaderProps, ImageProps } from 'next/image';
import { cloudinaryCloudName, getCloudinaryFallbackUrl, getCloudinaryUrl } from '@/lib/cloudinary';

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
    const hasCloudinary = Boolean(cloudinaryCloudName);
    const encodedPublicId = encodeURIComponent(src).replace(/%2F/g, '/');

    const cloudinaryLoader = ({ src: requestedSrc, width: requestedWidth, quality }: ImageLoaderProps) =>
        getCloudinaryUrl(decodeURIComponent(requestedSrc.replace(/^\//, '')), {
            width: requestedWidth,
            quality: quality ?? 'auto',
            format: 'auto',
            crop: 'limit',
            maxDimension: 2400,
        });

    return (
        <Image
            src={hasCloudinary ? `/${encodedPublicId}` : getCloudinaryFallbackUrl(Number(width) || 800, Number(height) || 600)}
            loader={hasCloudinary ? cloudinaryLoader : undefined}
            width={width}
            height={height}
            alt={alt}
            className={className}
            unoptimized={hasCloudinary ? unoptimized : true}
            {...props}
        />
    );
}
