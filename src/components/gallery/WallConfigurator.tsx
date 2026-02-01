'use client';

import React from 'react';
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
    transform = { x: 0, y: 0, scale: 1 },
    workspaceWidth = 1440,
    workspaceHeight = 900
}: WallConfiguratorProps & { workspaceWidth?: number, workspaceHeight?: number }) {

    // --- Unified Scaling Logic ---
    // The room coordinate system is fixed at 2400x1600.
    // We scale the whole room (background + art) to cover/fill the workspace.
    const baseW = 2400;
    const baseH = 1600;

    // We use Math.max to ensure the room always COVERS the workspace (like object-cover)
    const zoom = Math.max(workspaceWidth / baseW, workspaceHeight / baseH);

    // --- Frame & Mat Logic ---
    // ... (rest of the logic remains same, but we will use the zoom for the parent)

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
            {/* Unified Scaled Container */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
                style={{
                    width: baseW,
                    height: baseH,
                    transform: `translate(-50%, -50%) scale(${zoom})`,
                    transformOrigin: 'center center'
                }}
            >
                {/* Background Environment Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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

                    {/* Environment Filters */}
                    <div className={cn(
                        "absolute inset-0 transition-colors duration-700",
                        environment === 'home' && "bg-[#5c4d3c]/20 mix-blend-overlay",
                        environment === 'business' && "bg-black/40 mix-blend-multiply",
                        environment === 'office' && "bg-blue-900/10 mix-blend-overlay"
                    )} />
                </div>

                {/* Lighting Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none z-[1]" />

                {/* Main Stage (Aligned to 2400x1600 space) */}
                <div
                    className="absolute inset-0 z-10 flex items-center justify-center transition-transform duration-700 ease-in-out"
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
                                const isSingle = layout === 'single';
                                const isBigSlot = layout === 'collage-5' && (index === 0 || index === 1);
                                const colSpan = isBigSlot ? 'col-span-3' : layout === 'collage-5' ? 'col-span-2' : '';

                                // Simplified styling - let the scale handle it
                                const photoStyle: React.CSSProperties = photo ? {
                                    aspectRatio: `${photo.width} / ${photo.height}`,
                                    width: isSingle ? 'auto' : '100%',
                                    height: isSingle ? '700px' : 'auto',
                                    maxHeight: isSingle ? '700px' : isBigSlot ? '500px' : '350px'
                                } : {
                                    aspectRatio: '1',
                                    width: '100%'
                                };

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
                                        <div
                                            className={cn(
                                                "relative transition-all duration-500",
                                                activeSlotIndex === index && !photo ? "ring-2 ring-white/50 ring-offset-4 ring-offset-transparent" : "",
                                                activeSlotIndex === index && photo ? "scale-[1.02] z-20" : "hover:scale-[1.02] hover:z-10",
                                                !photo && "bg-white/5 backdrop-blur-[2px] border border-white/10 rounded-sm hover:bg-white/10 transition-all duration-500 w-full"
                                            )}
                                            style={photoStyle}
                                        >
                                            {photo ? (
                                                <div className="w-full h-full relative" style={getFrameStyles(frameStyle)}>
                                                    <div className={cn("w-full h-full relative overflow-hidden bg-neutral-50", matClasses)}>
                                                        <div className="relative w-full h-full shadow-[inset_1px_1px_15px_rgba(0,0,0,0.15)]">
                                                            {photo.cloudinaryId && cloudinaryCloudName ? (
                                                                <CldImage
                                                                    src={photo.cloudinaryId}
                                                                    alt={photo.alt}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="400px" // Better estimate for grid
                                                                />
                                                            ) : (
                                                                <Image
                                                                    src={photo.src}
                                                                    alt={photo.alt}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="400px"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none mix-blend-soft-light opacity-60" />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onClearSlot(index); }}
                                                        className="absolute -top-3 -right-3 bg-neutral-900/80 backdrop-blur-md text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-50 hover:bg-red-500"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-3">
                                                    <Plus size={isSingle ? 32 : 18} />
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
