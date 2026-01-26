'use client';

import { useState } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { Photo, GalleryEnvironment, LayoutTemplate, FrameStyle, MatOption } from '@/content/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, X } from 'lucide-react';
import { cloudinaryCloudName } from '@/lib/cloudinary';

interface WallConfiguratorProps {
    environment: GalleryEnvironment;
    layout: LayoutTemplate;
    frameStyle: FrameStyle;
    matOption: MatOption;
    slots: (Photo | null)[];
    activeSlotIndex: number;
    onSlotClick: (index: number) => void;
    onClearSlot: (index: number) => void;
}

export default function WallConfigurator({
    environment,
    layout,
    frameStyle,
    matOption,
    slots,
    activeSlotIndex,
    onSlotClick,
    onClearSlot
}: WallConfiguratorProps) {

    // Background Map
    const envBackgrounds: Record<GalleryEnvironment, string> = {
        home: 'bg-[#E5E0D8]', // Warm neutral
        office: 'bg-[#D0D4D9]', // Cool grey
        business: 'bg-[#1C1C1C]', // Dark modern
    };

    // In a real app, these would be actual images like /env/home-wall.jpg using <Image fill />
    // For v1 without 3D, we use colors + optional CSS gradients to simulate lighting

    // Frame Styling Logic
    const getFrameClasses = (style: FrameStyle) => {
        switch (style) {
            case 'thin-black': return 'border-[12px] border-black shadow-xl';
            case 'thin-white': return 'border-[12px] border-white shadow-xl';
            case 'natural-wood': return 'border-[12px] border-[#8B5E3C] shadow-xl';
            default: return 'border-black';
        }
    };

    const getMatClasses = (mat: MatOption) => {
        if (mat === 'none') return '';
        // "Mat" is essentially padding inside the border
        return 'p-4 md:p-8 bg-white';
    };

    // Slot positions based on layout
    // This is the "Hard" part - CSS Grid is easiest for deterministic layouts
    const getGridClasses = (template: LayoutTemplate) => {
        switch (template) {
            case 'single': return 'grid-cols-1 max-w-3xl';
            case 'gallery-6': return 'grid-cols-3 grid-rows-2 max-w-5xl gap-8';
            case 'collage-5': return 'grid-cols-3 grid-rows-2 max-w-5xl gap-4'; // simplified
            case 'collage-7': return 'grid-cols-4 grid-rows-2 max-w-6xl gap-4'; // simplified
            case 'collage-9': return 'grid-cols-3 grid-rows-3 max-w-4xl gap-4';
            default: return 'grid-cols-1';
        }
    };

    return (
        <div className={cn("flex-1 relative transition-colors duration-700 overflow-hidden", envBackgrounds[environment])}>

            {/* Wall Shadow / Lighting Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

            {/* Canvas Area */}
            <div className="w-full h-full flex items-center justify-center p-12 md:p-24 overflow-auto">
                <motion.div
                    layout
                    className={cn('grid transition-all duration-500', getGridClasses(layout))}
                >
                    {slots.map((photo, index) => (
                        <motion.div
                            key={index}
                            layoutId={`slot-${index}`}
                            onClick={() => onSlotClick(index)}
                            className={cn(
                                "relative aspect-[4/3] cursor-pointer transition-all duration-300",
                                activeSlotIndex === index ? "ring-4 ring-[#F1641E] ring-offset-4 ring-offset-transparent scale-[1.02] z-10" : "hover:scale-[1.01]",
                                !photo && "bg-black/5 border-2 border-dashed border-black/10 flex items-center justify-center hover:bg-black/10"
                            )}
                        >
                            {photo ? (
                                <div className={cn("w-full h-full transition-all duration-500 bg-white", getFrameClasses(frameStyle))}>
                                    <div className={cn("w-full h-full overflow-hidden relative", getMatClasses(matOption))}>
                                        {photo.cloudinaryId && cloudinaryCloudName ? (
                                            <CldImage
                                                src={photo.cloudinaryId}
                                                alt={photo.alt}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <Image
                                                src={photo.src}
                                                alt={photo.alt}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onClearSlot(index); }}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity z-20"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-black/30 text-xs font-medium uppercase tracking-widest">
                                    {activeSlotIndex === index ? 'Select Photo' : 'Empty'}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Tutorial / Status Text */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-sm text-sm font-medium text-gray-600">
                {slots.filter(s => s).length === 0
                    ? "Select a layout, then click a slot to fill it"
                    : "Try changing environments or frames"
                }
            </div>

        </div>
    );
}
