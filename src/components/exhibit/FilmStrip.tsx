'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Photo } from '@/content/types';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/motion';

interface FilmStripProps {
    photos: Photo[];
    onPhotoClick: (photo: Photo) => void;
    className?: string;
    isActive: boolean;
}

export default function FilmStrip({ photos, onPhotoClick, className, isActive }: FilmStripProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Simple drag scroll handler
    const handleDrag = (e: React.MouseEvent) => {
        // Implementation note: a robust drag-to-scroll often requires more state
        // For v1, relying on native overflow-x-auto with touch/trackpad support + buttons
        // is safer than a complex JS drag implementation that might conflict with scroll-snap
    };

    if (!isActive) return null;

    return (
        <motion.div
            className={cn('w-full', className)}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div
                ref={containerRef}
                className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-8 pb-12 pt-4 no-scrollbar items-center"
                role="region"
                aria-label="Photo strip"
            >
                {/* Spacer for first item */}
                <div className="flex-shrink-0 w-8 md:w-32" />

                {photos.map((photo, index) => (
                    <motion.button
                        key={photo.id}
                        onClick={() => onPhotoClick(photo)}
                        className="flex-shrink-0 snap-center group outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                            width: photo.orientation === 'landscape' ? '60vw' : '40vw',
                            maxWidth: photo.orientation === 'landscape' ? '800px' : '500px',
                            minWidth: '300px',
                        }}
                    >
                        <div className="bg-white p-2 md:p-6 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                            <div className="relative bg-gray-100 overflow-hidden" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
                                {photo.cloudinaryId ? (
                                    <CldImage
                                        src={photo.cloudinaryId}
                                        alt={photo.alt}
                                        width={photo.width}
                                        height={photo.height}
                                        className="w-full h-full object-cover"
                                        sizes="(max-width: 768px) 80vw, 60vw"
                                        priority={index < 2}
                                    />
                                ) : (
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt}
                                        width={photo.width}
                                        height={photo.height}
                                        className="w-full h-full object-cover"
                                        sizes="(max-width: 768px) 80vw, 60vw"
                                        priority={index < 2}
                                    />
                                )}
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>

                            <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="font-serif text-sm tracking-wide">{photo.title}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">View</span>
                            </div>
                        </div>
                    </motion.button>
                ))}

                {/* Spacer for last item */}
                <div className="flex-shrink-0 w-8 md:w-32" />
            </div>
        </motion.div>
    );
}
