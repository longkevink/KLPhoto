'use client';

import React from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { Photo, GalleryEnvironment, LayoutTemplate, FrameStyle, MatOption } from '@/content/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { cloudinaryCloudName } from '@/lib/cloudinary';
import { useDroppable } from '@dnd-kit/core';

// Inner component for Droppable Logic
const WallSlot = ({
    index,
    photo,
    activeSlotIndex,
    onSlotClick,
    onClearSlot,
    gridConfig,
    layout,
    frameStyle,
    matClasses,
    colSpan
}: any) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `slot-${index}`,
    });

    const isSingle = layout === 'single';
    // For Single AND Grid views: we want the image to define the aspect ratio
    const isGridFit = layout === 'gallery-6' || layout.startsWith('collage');

    const gridCellStyle: React.CSSProperties = (isSingle || isGridFit) ? {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    } : {
        width: '100%',
        height: '100%'
    };

    return (
        <motion.div
            ref={setNodeRef}
            key={`slot-${index}`}
            layoutId={isSingle ? undefined : `slot-${index}`}
            onClick={() => onSlotClick(index)}
            className={cn(
                "relative group cursor-pointer transition-all duration-300 flex items-center justify-center",
                gridConfig.item,
                colSpan,
                isOver && !photo && "ring-2 ring-white scale-105 z-20" // Highlight when dragging over
            )}
            style={gridCellStyle}
        >
            <div
                className={cn(
                    "relative transition-all duration-500",
                    activeSlotIndex === index && !photo ? "ring-2 ring-white/50 ring-offset-4 ring-offset-transparent" : "",
                    activeSlotIndex === index && photo ? "scale-[1.02] z-20" : "hover:scale-[1.02] hover:z-10",
                    !photo && "bg-white/5 backdrop-blur-[2px] border border-white/10 rounded-sm hover:bg-white/10 transition-all duration-500 w-full aspect-square"
                )}
                style={(photo && (isSingle || isGridFit)) ? {
                    // For single/grid, constraints come from parent flex item max-w/h
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto'
                } : {
                    width: '100%',
                    height: '100%',
                }}
            >
                {photo ? (
                    <div className="w-full h-full relative" style={{
                        ...((frameStyle === 'thin-black' && {
                            border: '12px solid #1a1a1a',
                            boxShadow: `inset 0 0 2px rgba(255,255,255,0.1), 0 10px 20px -5px rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.3)`,
                            backgroundColor: '#1a1a1a'
                        }) || (frameStyle === 'thin-white' && {
                            border: '12px solid #f5f5f5',
                            boxShadow: `inset 0 0 2px rgba(0,0,0,0.05), 0 10px 20px -5px rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.3)`,
                            backgroundColor: '#f5f5f5'
                        }) || (frameStyle === 'natural-wood' && {
                            border: '14px solid #8B5E3C',
                            backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent), linear-gradient(0deg, #8B5E3C, #A06F4B)`,
                            backgroundSize: '4px 4px, 100% 100%',
                            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.2), 0 10px 20px -5px rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.3)`,
                        }) || { border: '10px solid black' })
                    }}>
                        <div className={cn("w-full h-full relative overflow-hidden bg-neutral-50", matClasses)}>
                            <div className="relative w-full h-full shadow-[inset_1px_1px_15px_rgba(0,0,0,0.15)]">
                                {(photo.cloudinaryId && cloudinaryCloudName) ? (
                                    <CldImage
                                        src={photo.cloudinaryId}
                                        alt={photo.alt}
                                        fill={!(isSingle || isGridFit)}
                                        width={(isSingle || isGridFit) ? photo.width : undefined}
                                        height={(isSingle || isGridFit) ? photo.height : undefined}
                                        className={cn(
                                            "object-cover",
                                            (isSingle || isGridFit) && "max-w-full max-h-full w-auto h-auto"
                                        )}
                                        sizes={(isSingle || isGridFit) ? "50vw" : "(max-width: 768px) 100vw, 33vw"}
                                    />
                                ) : (
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt}
                                        fill={!(isSingle || isGridFit)}
                                        width={(isSingle || isGridFit) ? photo.width : undefined}
                                        height={(isSingle || isGridFit) ? photo.height : undefined}
                                        className={cn(
                                            "object-cover",
                                            (isSingle || isGridFit) && "max-w-full max-h-full w-auto h-auto"
                                        )}
                                        sizes={(isSingle || isGridFit) ? "50vw" : "(max-width: 768px) 100vw, 33vw"}
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
}



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

    // Calculate offsets to center the scaled room
    const offsetX = (workspaceWidth - baseW * zoom) / 2;
    const offsetY = (workspaceHeight - baseH * zoom) / 2;

    // Environment background mapping
    const envBackgrounds: Record<GalleryEnvironment, { id: string; fallback: string }> = {
        home: { id: 'home_ehrv5c', fallback: '/photos/travel-01.jpg' },
        office: { id: 'OFFICE_BACKGROUND_pjldjl', fallback: '/photos/moments-01.jpg' },
        business: { id: 'coffeehouse_qg2maq', fallback: '/photos/street-01.jpg' },
    };

    const currentBg = envBackgrounds[environment];

    // Realistic Frame styles using box-shadows
    const getFrameStyles = (style: FrameStyle) => {
        const baseShadow = "0 10px 20px -5px rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.3)";

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
                    border: '14px solid #8B5E3C',
                    backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent), linear-gradient(0deg, #8B5E3C, #A06F4B)`,
                    backgroundSize: '4px 4px, 100% 100%',
                    boxShadow: `inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.2), ${baseShadow}`,
                };
            default:
                return { border: '10px solid black' };
        }
    };

    const matClasses = matOption === 'white' ? "p-[8%] bg-[#fdfdfd] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]" : "p-0";

    // --- Safe Zones Configuration ---
    // Defines the "mountable" wall area for each environment as percentages
    type WallZoneDisplay = {
        top: string;
        left: string;
        width: string;
        height: string;
    };

    type WallZone = WallZoneDisplay & {
        overrides?: Partial<Record<LayoutTemplate, Partial<WallZoneDisplay>>> & {
            'single-portrait'?: Partial<WallZoneDisplay>;
            'single-landscape'?: Partial<WallZoneDisplay>;
        };
    };

    const wallZones: Record<GalleryEnvironment, WallZone> = {
        home: {
            // Calibrated: 10% larger and moved up 8%
            top: '19%',      // 27% - 8%
            left: '35.25%',  // Centered for 29.5% width
            width: '29.5%',  // 26.8% * 1.1
            height: '19.6%', // 17.8% * 1.1
            overrides: {
                'single-landscape': {
                    top: '22%',  // 30% - 8%
                    left: '40.25%',// Centered
                    width: '19.5%',// 17.7% * 1.1
                    height: '17.2%'// 15.6% * 1.1
                },
                'single-portrait': {
                    top: '19%',  // 27% - 8%
                    left: '46.1%', // Centered
                    width: '7.8%', // 7.1% * 1.1
                    height: '19.7%'// 17.9% * 1.1
                }
            }
        },
        office: {
            // Calibrated: Scaled down 5%, Lowered 5%
            top: '25%',      // 20% + 5%
            left: '16.25%',  // Centered for 47.5% width
            width: '47.5%',  // 50% * 0.95
            height: '42.75%',// 45% * 0.95
            overrides: {
                'single-portrait': {
                    top: '27%',  // 22% + 5%
                    left: '28.6%',// Centered for 22.8% width
                    width: '22.8%',// 24% * 0.95
                    height: '42.75%'// 45% * 0.95
                }
            }
        },
        business: {
            // Calibrated: Scaled down additional 15%
            top: '18%',
            left: '30.9%',     // Centered for 38.2% width
            width: '38.2%',    // 45% * 0.85
            height: '30.6%',   // 36% * 0.85
            overrides: {
                'single-landscape': {
                    top: '20%',
                    left: '32%',    // Keeping existing single overrides for consistency
                    width: '36%',
                    height: '31.5%'
                },
                'single-portrait': {
                    top: '18%',
                    left: '41%',
                    width: '18%',
                    height: '40.5%'
                }
            }
        }
    };

    const baseZone = wallZones[environment];

    // Determine the specific layout key for overrides
    const photo = slots[0]; // For single layout, this is the main image
    let layoutKey: string = layout;
    if (layout === 'single' && photo) {
        layoutKey = `single-${photo.orientation || 'landscape'}`;
    }

    const currentZone = {
        ...baseZone,
        ...(baseZone.overrides?.[layoutKey as LayoutTemplate] || baseZone.overrides?.[layout] || {})
    };


    // --- Layout Logic ---
    const getGridConfig = (template: LayoutTemplate) => {
        // Now valid within the Safe Zone, so we use full width/height of that zone
        switch (template) {
            case 'single':
                return {
                    container: 'flex items-center justify-center w-full h-full p-4',
                    item: 'relative w-auto h-auto max-h-[90%] max-w-[90%] flex items-center justify-center'
                };
            case 'gallery-6':
                return {
                    container: 'grid grid-cols-3 grid-rows-2 gap-6 w-full h-full items-center content-center px-4',
                    item: 'w-full h-full flex items-center justify-center'
                };
            case 'collage-5':
                return {
                    container: 'grid grid-cols-6 gap-3 w-full h-full items-center content-center px-4',
                    item: 'w-full flex items-center justify-center'
                };
            case 'collage-7':
                return {
                    container: 'grid grid-cols-4 gap-3 w-full h-full items-center content-center px-4',
                    item: 'w-full flex items-center justify-center'
                };
            case 'collage-9':
                return {
                    container: 'grid grid-cols-3 gap-3 w-full h-full items-center content-center px-4',
                    item: 'w-full aspect-square flex items-center justify-center'
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
                className="absolute transition-all duration-700 ease-in-out"
                style={{
                    width: `${baseW}px`,
                    height: `${baseH}px`,
                    transformOrigin: 'top left',
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                }}
            >
                {/* Background Environment Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={environment}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0"
                        >
                            {cloudinaryCloudName ? (
                                <CldImage
                                    src={currentBg.id}
                                    alt={`Gallery Environment - ${environment}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <Image
                                    src={currentBg.fallback}
                                    alt={`Gallery Environment - ${environment}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Environment Filters */}
                    <div className={cn(
                        "absolute inset-0 transition-colors duration-700",
                        environment === 'home' && "bg-[#5c4d3c]/20 mix-blend-overlay",
                        environment === 'office' && "bg-blue-900/10 mix-blend-overlay"
                    )} />
                </div>

                {/* Lighting Vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none z-[1]" />

                {/* Main Stage (Aligned to Safe Zones) */}
                <div
                    className="absolute z-10 transition-all duration-700 ease-in-out"
                    style={{
                        top: currentZone.top,
                        left: currentZone.left,
                        width: currentZone.width,
                        height: currentZone.height,
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
                    }}
                >
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`${layout}-${environment}`} // Re-render when env changes to recalc sizes
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={gridConfig.container}
                        >
                            {slots.map((photo, index) => {
                                const isBigSlot = layout === 'collage-5' && (index === 0 || index === 1);
                                const colSpan = isBigSlot ? 'col-span-3' : layout === 'collage-5' ? 'col-span-2' : '';

                                return (
                                    <WallSlot
                                        key={`slot-${index}`}
                                        index={index}
                                        photo={photo}
                                        activeSlotIndex={activeSlotIndex}
                                        onSlotClick={onSlotClick}
                                        onClearSlot={onClearSlot}
                                        gridConfig={gridConfig}
                                        layout={layout}
                                        frameStyle={frameStyle}
                                        matClasses={matClasses}
                                        colSpan={colSpan}
                                    />
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
