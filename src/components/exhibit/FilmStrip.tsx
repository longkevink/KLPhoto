'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { motion } from 'framer-motion';
import { PhotoCard } from '@/content/types';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/motion';
import { cloudinaryCloudName } from '@/lib/cloudinary';
import { useAdaptiveMotion } from '@/lib/useAdaptiveMotion';

interface FilmStripProps {
    photos: PhotoCard[];
    onPhotoClick: (photo: PhotoCard) => void;
    className?: string;
    isActive: boolean;
}

function HorizontalStrip({
    photos,
    onPhotoClick,
    rowIndex,
    disableMotion,
}: {
    photos: PhotoCard[];
    onPhotoClick: (photo: PhotoCard) => void;
    rowIndex: number;
    disableMotion: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDraggingMouse, setIsDraggingMouse] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'mouse' || !containerRef.current) return;
        setIsDraggingMouse(true);
        setStartX(event.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingMouse || event.pointerType !== 'mouse' || !containerRef.current) return;
        event.preventDefault();
        const x = event.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const endMouseDrag = () => {
        setIsDraggingMouse(false);
    };

    const handlePhotoClick = (event: React.MouseEvent, photo: PhotoCard) => {
        if (isDraggingMouse) {
            event.preventDefault();
            return;
        }
        onPhotoClick(photo);
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                'flex gap-4 md:gap-6 overflow-x-auto px-4 md:px-8 py-3 md:py-4 no-scrollbar touch-pan-x',
                isDraggingMouse ? 'cursor-grabbing' : 'cursor-grab',
                !isDraggingMouse && 'snap-x snap-mandatory'
            )}
            role="region"
            aria-label={`Photo strip row ${rowIndex + 1}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endMouseDrag}
            onPointerCancel={endMouseDrag}
            onPointerLeave={endMouseDrag}
        >
            {photos.map((photo, index) => (
                <motion.div
                    key={photo.id}
                    className="flex-shrink-0 snap-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={disableMotion ? { duration: 0 } : { delay: (rowIndex * photos.length + index) * 0.02 }}
                    style={{ height: 'min(45vh, 360px)' }}
                >
                    <button
                        onClick={(event) => handlePhotoClick(event, photo)}
                        className="group outline-none focus-visible:ring-2 focus-visible:ring-black rounded-sm h-full block text-left bg-white p-2 md:p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                        <div
                            className="relative bg-gray-100 overflow-hidden flex-grow pointer-events-none"
                            style={{
                                aspectRatio: `${photo.width} / ${photo.height}`,
                                height: 'auto',
                                width: 'auto',
                                maxHeight: '100%',
                            }}
                        >
                            {photo.cloudinaryId && cloudinaryCloudName ? (
                                <CldImage
                                    src={photo.cloudinaryId}
                                    alt={photo.alt}
                                    width={Math.round(1000 * (photo.width / photo.height))}
                                    height={1000}
                                    className="w-full h-full object-contain pointer-events-none"
                                    sizes="(max-width: 768px) 92vw, 50vw"
                                    priority={rowIndex === 0 && index < 3}
                                    loading={rowIndex === 0 && index < 3 ? 'eager' : 'lazy'}
                                />
                            ) : (
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={Math.round(1000 * (photo.width / photo.height))}
                                    height={1000}
                                    className="w-full h-full object-contain pointer-events-none"
                                    sizes="(max-width: 768px) 92vw, 50vw"
                                    priority={rowIndex === 0 && index < 3}
                                    loading={rowIndex === 0 && index < 3 ? 'eager' : 'lazy'}
                                />
                            )}
                            <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/5 transition-colors" />
                        </div>

                        <div className="mt-2 flex justify-between items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                            <span className="font-serif text-sm md:text-base tracking-wide truncate pr-2">{photo.title}</span>
                            <span className="text-[11px] md:text-sm text-gray-400 uppercase tracking-widest shrink-0">View</span>
                        </div>
                    </button>
                </motion.div>
            ))}
        </div>
    );
}

export default function FilmStrip({ photos, onPhotoClick, className, isActive }: FilmStripProps) {
    const shouldReduceMotion = useAdaptiveMotion();

    if (!isActive) return null;

    const rowCount = photos.length > 20 ? 4 : 3;
    const photosPerRow = Math.ceil(photos.length / rowCount);

    const rows: PhotoCard[][] = [];
    for (let i = 0; i < rowCount; i++) {
        const start = i * photosPerRow;
        const end = start + photosPerRow;
        const rowPhotos = photos.slice(start, end);
        if (rowPhotos.length > 0) {
            rows.push(rowPhotos);
        }
    }

    return (
        <motion.div className={cn('w-full', className)} initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex flex-col gap-3 md:gap-4">
                {rows.map((rowPhotos, rowIndex) => (
                    <HorizontalStrip
                        key={rowIndex}
                        photos={rowPhotos}
                        onPhotoClick={onPhotoClick}
                        rowIndex={rowIndex}
                        disableMotion={shouldReduceMotion}
                    />
                ))}
            </div>
        </motion.div>
    );
}
