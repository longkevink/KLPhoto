'use client';

import { memo } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { PhotoCard, PhotoCategory } from '@/content/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cloudinaryCloudName } from '@/lib/cloudinary';
import { useDraggable } from '@dnd-kit/core';
import { useAdaptiveMotion } from '@/lib/useAdaptiveMotion';

interface DraggablePhotoProps {
    photo: PhotoCard;
    onSelect: (photo: PhotoCard) => void;
    disableMotion?: boolean;
    compact?: boolean;
}

const DraggablePhoto = memo(function DraggablePhoto({ photo, onSelect, disableMotion, compact = false }: DraggablePhotoProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: photo.id,
        data: photo,
    });

    return (
        <motion.button
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            key={photo.id}
            onClick={() => onSelect(photo)}
            whileHover={disableMotion ? undefined : { scale: 1.03, y: -2 }}
            whileTap={disableMotion ? undefined : { scale: 0.98 }}
            className={cn(
                'break-inside-avoid group relative w-full bg-neutral-100 rounded-lg overflow-hidden focus-visible:ring-2 focus-visible:ring-black outline-none shadow-sm transition-all flex items-center justify-center touch-none tap-target',
                compact ? 'mb-0' : 'mb-3',
                photo.orientation === 'landscape' ? "aspect-[3/2]" : "aspect-[2/3]",
                !disableMotion && "hover:shadow-md",
                isDragging && "opacity-50 grayscale"
            )}
        >
            {photo.cloudinaryId && cloudinaryCloudName ? (
                <CldImage
                    src={photo.cloudinaryId}
                    alt={photo.alt}
                    width={300}
                    height={300}
                    className={cn("w-full h-full object-cover", !disableMotion && "transition-transform duration-500 group-hover:scale-110")}
                    sizes="(max-width: 640px) 40vw, 220px"
                    loading="lazy"
                />
            ) : (
                <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={300}
                    height={300}
                    className={cn("w-full h-full object-cover", !disableMotion && "transition-transform duration-500 group-hover:scale-110")}
                    sizes="(max-width: 640px) 40vw, 220px"
                    loading="lazy"
                />
            )}
            <div className={cn("absolute inset-0 bg-black/0", !disableMotion && "group-hover:bg-black/10 transition-colors duration-300")} />

            {/* Plus Icon Overlay */}
            <div className={cn("absolute inset-0 flex items-center justify-center opacity-0", !disableMotion && "group-hover:opacity-100 transition-opacity duration-200")}>
                <div className="bg-white/90 p-1.5 rounded-full shadow-sm text-black">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>
            </div>
        </motion.button>
    );
});

interface PhotoPickerProps {
    photosGrouped: Record<PhotoCategory, PhotoCard[]>;
    onPhotoSelect: (photo: PhotoCard) => void;
    performanceMode?: boolean;
    compact?: boolean;
    className?: string;
}

export default function PhotoPicker({
    photosGrouped,
    onPhotoSelect,
    performanceMode = false,
    compact = false,
    className,
}: PhotoPickerProps) {
    const categories: PhotoCategory[] = ['travel', 'street'];
    const shouldReduceMotion = useAdaptiveMotion() || performanceMode;

    return (
        <aside
            className={cn(
                compact
                    ? 'w-full h-auto rounded-2xl bg-white border border-neutral-100 overflow-y-auto flex flex-col z-10'
                    : 'w-80 h-full bg-white border-r border-neutral-100 overflow-y-auto flex flex-col z-10 scrollbar-thin scrollbar-thumb-neutral-200',
                className
            )}
        >
            <div className={cn(compact ? 'p-4 border-b border-neutral-100' : 'p-6 sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-neutral-50')}>
                <h2 className={cn('font-serif tracking-tight text-neutral-900', compact ? 'text-xl' : 'text-2xl')}>Collections</h2>
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                    {compact ? 'Tap a photo to add it to the active slot.' : 'Drag or click photos to add to wall.'}
                </p>
            </div>

            <div className={cn(compact ? 'p-4 space-y-6 pb-6' : 'p-6 space-y-10 pb-20')}>
                {categories.map((category) => (
                    <div key={category}>
                        <div className={cn('flex items-center justify-between mb-3', compact ? '' : 'sticky top-[88px] bg-white/95 py-2 z-10 backdrop-blur-sm')}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                {category}
                            </h3>
                            <span className="text-[10px] text-neutral-300 font-medium px-2 py-0.5 bg-neutral-50 rounded-full">
                                {photosGrouped[category]?.length || 0}
                            </span>
                        </div>

                        <div className={cn(compact ? 'grid grid-cols-3 gap-2' : 'columns-2 gap-3 space-y-3')}>
                            {photosGrouped[category]?.map((photo) => (
                                <DraggablePhoto
                                    key={photo.id}
                                    photo={photo}
                                    onSelect={onPhotoSelect}
                                    disableMotion={shouldReduceMotion}
                                    compact={compact}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
