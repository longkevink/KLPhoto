'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { motion } from 'framer-motion';

import { Photo } from '@/content/types';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/motion';
import { cloudinaryCloudName } from '@/lib/cloudinary';

interface FilmStripProps {
    photos: Photo[];
    onPhotoClick: (photo: Photo) => void;
    className?: string;
    isActive: boolean;
}

// Single horizontal strip component
function HorizontalStrip({
    photos,
    onPhotoClick,
    rowIndex
}: {
    photos: Photo[];
    onPhotoClick: (photo: Photo) => void;
    rowIndex: number;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // scroll speed multiplier
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Prepare click handler - prevent click if we were dragging
    const handlePhotoClick = (e: React.MouseEvent, photo: Photo) => {
        if (isDragging) {
            e.stopPropagation();
            return;
        }
        onPhotoClick(photo);
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "flex gap-6 overflow-x-auto px-8 py-4 no-scrollbar cursor-grab active:cursor-grabbing",
                !isDragging && "snap-x snap-mandatory" // Disable snap while dragging for smoothness
            )}
            role="region"
            aria-label={`Photo strip row ${rowIndex + 1}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {photos.map((photo, index) => (
                <motion.div
                    key={photo.id}
                    className="flex-shrink-0 snap-center" // Snap alignment
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (rowIndex * photos.length + index) * 0.02 }}
                    style={{
                        height: '45vh',
                    }}
                >
                    <button
                        onClick={(e) => handlePhotoClick(e, photo)}
                        className="group outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm h-full block text-left bg-white p-3 md:p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                        <div
                            className="relative bg-gray-100 overflow-hidden flex-grow pointer-events-none" // prevent image drag
                            style={{
                                aspectRatio: `${photo.width} / ${photo.height}`,
                                height: 'auto',
                                width: 'auto',
                                maxHeight: '100%'
                            }}
                        >
                            {photo.cloudinaryId && cloudinaryCloudName ? (
                                <CldImage
                                    src={photo.cloudinaryId}
                                    alt={photo.alt}
                                    width={Math.round(1000 * (photo.width / photo.height))}
                                    height={1000}
                                    className="w-full h-full object-contain pointer-events-none"
                                    sizes="(max-width: 768px) 90vw, 50vw"
                                    priority={rowIndex === 0 && index < 3}
                                />
                            ) : (
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={Math.round(1000 * (photo.width / photo.height))}
                                    height={1000}
                                    className="w-full h-full object-contain pointer-events-none"
                                    sizes="(max-width: 768px) 90vw, 50vw"
                                    priority={rowIndex === 0 && index < 3}
                                />
                            )}
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>

                        <div className="mt-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                            <span className="font-serif text-sm md:text-base tracking-wide truncate pr-2">{photo.title}</span>
                            <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest shrink-0">View</span>
                        </div>
                    </button>
                </motion.div>
            ))}
        </div>
    );
}

export default function FilmStrip({ photos, onPhotoClick, className, isActive }: FilmStripProps) {
    if (!isActive) return null;

    // Split photos into rows (3-4 rows based on photo count)
    const rowCount = photos.length > 20 ? 4 : 3;
    const photosPerRow = Math.ceil(photos.length / rowCount);

    const rows: Photo[][] = [];
    for (let i = 0; i < rowCount; i++) {
        const start = i * photosPerRow;
        const end = start + photosPerRow;
        const rowPhotos = photos.slice(start, end);
        if (rowPhotos.length > 0) {
            rows.push(rowPhotos);
        }
    }

    return (
        <motion.div
            className={cn('w-full', className)}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="flex flex-col gap-4">
                {rows.map((rowPhotos, rowIndex) => (
                    <HorizontalStrip
                        key={rowIndex}
                        photos={rowPhotos}
                        onPhotoClick={onPhotoClick}
                        rowIndex={rowIndex}
                    />
                ))}
            </div>
        </motion.div>
    );
}
