'use client';

import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { motion } from 'framer-motion';
import { Photo } from '@/content/types';
import { cn } from '@/lib/utils';
import { imageReveal, staggerContainer } from '@/lib/motion';
import { cloudinaryCloudName } from '@/lib/cloudinary';

interface MasonryGalleryProps {
    photos: Photo[];
    className?: string;
}

export default function MasonryGallery({ photos, className }: MasonryGalleryProps) {
    return (
        <motion.div
            className={cn('columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8', className)}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            {photos.map((photo) => (
                <motion.div
                    key={photo.id}
                    className="break-inside-avoid relative group overflow-hidden"
                    variants={imageReveal}
                >
                    <div className="relative w-full overflow-hidden bg-gray-100">
                        {/* Aspect Ratio hack for preventing layout shift if size is known */}
                        <div style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
                            {photo.cloudinaryId && cloudinaryCloudName ? (
                                <CldImage
                                    src={photo.cloudinaryId}
                                    alt={photo.alt}
                                    width={photo.width}
                                    height={photo.height}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={photo.width}
                                    height={photo.height}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                        {/* Title Reveal */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                            <p className="font-serif text-white text-lg tracking-wide drop-shadow-md">
                                {photo.title}
                            </p>
                            <p className="text-white/80 text-xs uppercase tracking-wider mt-1 drop-shadow-sm">
                                {photo.category}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
