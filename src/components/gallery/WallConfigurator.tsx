'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { Photo, GalleryEnvironment, LayoutTemplate, FrameStyle, MatOption } from '@/content/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
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
    transform?: { x: number; y: number; scale: number };
}

export default function WallConfigurator({
    environment,
    layout,
    frameStyle,
    matOption,
    slots,
    activeSlotIndex,
    onSlotClick,
    onClearSlot,
    transform = { x: 0, y: 0, scale: 1 }
}: WallConfiguratorProps) {

    // --- Frame & Mat Logic ---

    // Realistic Frame styles using box-shadows
    const getFrameStyles = (style: FrameStyle) => {
        const baseShadow = "0 10px 20px -5px rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.3)"; // Deeper shadow for photo background

        switch (style) {
            case 'thin-black':
                return {
                    border: '12px solid #1a1a1a',
                    boxShadow: `inset 0 0 2px rgba(255,255,255,0.1), ${baseShadow}`,
                    backgroundColor: '#1a1a1a'
                };
            case 'thin-white':
                return {
                    border: '12px solid #f5f5f5',
                    boxShadow: `inset 0 0 2px rgba(0,0,0,0.05), ${baseShadow}`,
                    backgroundColor: '#f5f5f5'
                };
            case 'natural-wood':
                return {
                    border: '14px solid #8B5E3C', // Fallback color
                    backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent), linear-gradient(0deg, #8B5E3C, #A06F4B)`,
                    backgroundSize: '4px 4px, 100% 100%',
                    boxShadow: `inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.2), ${baseShadow}`,
                };
            default:
                return { border: '10px solid black' };
        }
    };

    const matClasses = matOption === 'white' ? "p-[8%] bg-[#fdfdfd] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]" : "p-0";

    // --- Layout Logic ---

    // Dynamic grid classes
    const getGridConfig = (template: LayoutTemplate) => {
        switch (template) {
            case 'single':
                return {
                    container: 'flex items-center justify-center w-full h-full p-8 md:p-16',
                    item: 'relative w-auto h-auto max-h-[70vh] max-w-[90vw] shadow-2xl flex items-center justify-center'
                };
            case 'gallery-6':
                return {
                    container: 'grid grid-cols-3 gap-8 md:gap-12 max-w-7xl w-full mx-auto px-8 py-12 items-start justify-center', // items-start allows rows to grow naturally
                    item: 'w-full flex items-center justify-center min-h-[200px]' // min-h for empty state stability
                };
            case 'collage-5':
                return {
                    container: 'grid grid-cols-6 gap-4 max-w-6xl w-full mx-auto px-8 items-center justify-center', // Removed strict rows to allow flow
                    item: 'w-full flex items-center justify-center min-h-[150px]'
                };
            case 'collage-7':
                return {
                    container: 'grid grid-cols-4 gap-4 max-w-6xl w-full mx-auto px-8 items-center justify-center',
                    item: 'w-full flex items-center justify-center min-h-[150px]'
                };
            case 'collage-9':
                return {
                    container: 'grid grid-cols-3 gap-4 md:gap-8 max-w-5xl w-full mx-auto px-8 items-center justify-center',
                    item: 'w-full flex items-center justify-center min-h-[150px]'
                };
            default:
                return { container: '', item: '' };
        }
    };

    const gridConfig = getGridConfig(layout);

    return (
        <div className="flex-1 relative overflow-hidden flex flex-col h-full w-full bg-neutral-900">

            {/* Background Environment Layer - Static Sizing */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Fixed large container centered to keep background scale constant across browser sizes */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2400px] h-[1600px]">
                    {cloudinaryCloudName ? (
                        <CldImage
                            src="OFFICE_BACKGROUND_pjldjl"
                            alt="Gallery Environment"
                            fill
                            className="object-cover opacity-90"
                            priority
                        />
                    ) : (
                        <Image
                            src="/photos/moments-01.jpg"
                            alt="Gallery Environment"
                            fill
                            className="object-cover opacity-90"
                            priority
                        />
                    )}
                </div>

                {/* Environment Filters based on selection (simulated) */}
                <div className={cn(
                    "absolute inset-0 transition-colors duration-700",
                    environment === 'home' && "bg-[#5c4d3c]/20 mix-blend-overlay", // Warm it up
                    environment === 'business' && "bg-black/40 mix-blend-multiply", // Darken it
                    environment === 'office' && "bg-blue-900/10 mix-blend-overlay" // Cool it down
                )} />
            </div>

            {/* Lighting Vignette - crucial for depth against photo */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none z-[1]" />

            {/* Main Stage */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden">
                <div
                    className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
                    }}
                >
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={layout}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={gridConfig.container}
                        >
                            {slots.map((photo, index) => {
                                // Logic for Single View Scaling
                                const isSingle = layout === 'single';

                                // Collage Spanning Logic
                                // We define this BEFORE style calculation so we can adjust max-heights for big slots
                                const isBigSlot = layout === 'collage-5' && (index === 0 || index === 1);
                                const colSpan = isBigSlot ? 'col-span-3' :
                                    layout === 'collage-5' ? 'col-span-2' : '';

                                // --- Dynamic Frame Sizing Logic ---

                                let frameStyle: any = {};

                                if (isSingle && photo) {
                                    // Single view: Fixed height constraint, allow width to flow
                                    frameStyle = {
                                        aspectRatio: `${photo.width} / ${photo.height}`,
                                        height: '70vh',
                                        width: 'auto'
                                    };
                                } else if (isSingle && !photo) {
                                    // Empty Single view
                                    frameStyle = { aspectRatio: '3/2', height: '60vh' };
                                } else if (photo) {
                                    // Grid/Collage view with Photo
                                    // We MUST anchor one dimension so aspect-ratio has something to work with.
                                    // otherwise width:auto + height:auto + fill-image = collapse.

                                    const isLandscape = photo.width >= photo.height;
                                    const maxPortraitHeight = isBigSlot ? '550px' : '400px';

                                    if (isLandscape) {
                                        // Anchor to the column width
                                        frameStyle = {
                                            aspectRatio: `${photo.width} / ${photo.height}`,
                                            width: '100%',
                                            height: 'auto'
                                        };
                                    } else {
                                        // Anchor to a fixed height to prevent super-tall elements
                                        frameStyle = {
                                            aspectRatio: `${photo.width} / ${photo.height}`,
                                            height: maxPortraitHeight,
                                            width: 'auto',
                                            // We also need max-width 100% just in case the height drives width wider than column
                                            maxWidth: '100%'
                                        };
                                    }

                                } else {
                                    // Empty Grid slot
                                    frameStyle = {
                                        aspectRatio: '1',
                                        width: '100%',
                                        height: 'auto'
                                    };
                                }

                                return (
                                    <motion.div
                                        key={`slot-${index}`}
                                        layoutId={isSingle ? undefined : `slot-${index}`}
                                        onClick={() => onSlotClick(index)}
                                        className={cn(
                                            "relative group cursor-pointer transition-all duration-300",
                                            gridConfig.item,
                                            colSpan
                                        )}
                                    >
                                        {/* Frame Container - This determines the shape */}
                                        <div
                                            className={cn(
                                                "relative transition-all duration-500",
                                                activeSlotIndex === index && !photo ? "ring-2 ring-[#F1641E] ring-offset-4 ring-offset-transparent" : "",
                                                activeSlotIndex === index && photo ? "scale-[1.02] z-20" : "hover:scale-[1.02] hover:z-10",
                                                !photo && "bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-sm hover:bg-white/20 transition-colors w-full"
                                            )}
                                            style={frameStyle}
                                        >
                                            {photo ? (
                                                <div
                                                    className="w-full h-full relative"
                                                    style={getFrameStyles(frameStyle)} // Applying frame border here
                                                >
                                                    <div className={cn("w-full h-full relative overflow-hidden bg-white", matClasses)}>
                                                        <div className="relative w-full h-full shadow-[inset_0_0_15px_rgba(0,0,0,0.15)]">
                                                            {photo.cloudinaryId && cloudinaryCloudName ? (
                                                                <CldImage
                                                                    src={photo.cloudinaryId}
                                                                    alt={photo.alt}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes={isSingle ? "80vw" : "(max-width: 768px) 50vw, 33vw"}
                                                                />
                                                            ) : (
                                                                <Image
                                                                    src={photo.src}
                                                                    alt={photo.alt}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes={isSingle ? "80vw" : "(max-width: 768px) 50vw, 33vw"}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Reflection Overlay (Glass) */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none mix-blend-overlay" />

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onClearSlot(index); }}
                                                        className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-50 hover:bg-red-600"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-2">
                                                    <Plus size={isSingle ? 48 : 24} className="opacity-70" />
                                                    <span className="text-xs font-medium uppercase tracking-widest opacity-70">
                                                        {isSingle ? 'Select a photo' : 'Add Photo'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
