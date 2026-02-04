'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import CldImage from '@/components/ui/CldImage';
import { PhotoCard, GalleryEnvironment, LayoutTemplate, FrameStyle, MatOption } from '@/content/types';
import { cloudinaryCloudName } from '@/lib/cloudinary';
import { useAdaptiveMotion } from '@/lib/useAdaptiveMotion';
import { cn } from '@/lib/utils';
import { WallSlot } from './WallSlot';
import { ENV_BACKGROUNDS, WALL_ZONES, WallZoneOverrideKey } from './wall.config';
import { getFrameStyles, getGridConfig } from './wall.styles';

interface WallConfiguratorProps {
    environment: GalleryEnvironment;
    layout: LayoutTemplate;
    frameStyle: FrameStyle;
    matOption: MatOption;
    slots: (PhotoCard | null)[];
    activeSlotIndex: number;
    onSlotClick: (index: number) => void;
    onClearSlot: (index: number) => void;
    transform?: { x: number; y: number; scale: number };
    workspaceWidth?: number;
    workspaceHeight?: number;
    isPerformanceMode?: boolean;
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
    workspaceHeight = 900,
    isPerformanceMode = false,
}: WallConfiguratorProps) {
    const shouldReduceMotion = useAdaptiveMotion() || isPerformanceMode;
    const { setNodeRef: setCanvasDropRef } = useDroppable({ id: 'wall-canvas' });

    const baseW = 2400;
    const baseH = 1600;

    const zoom = Math.max(workspaceWidth / baseW, workspaceHeight / baseH);
    const offsetX = (workspaceWidth - baseW * zoom) / 2;
    const offsetY = (workspaceHeight - baseH * zoom) / 2;

    const matClasses = useMemo(
        () => (matOption === 'white' ? 'p-[8%] bg-[#fdfdfd] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)]' : 'p-0'),
        [matOption]
    );

    const frameStyles = useMemo(() => getFrameStyles(frameStyle, isPerformanceMode), [frameStyle, isPerformanceMode]);
    const gridConfig = useMemo(() => getGridConfig(layout), [layout]);

    const currentZone = useMemo(() => {
        const baseZone = WALL_ZONES[environment];
        const firstPhoto = slots[0];

        const layoutKey: WallZoneOverrideKey =
            layout === 'single' && firstPhoto
                ? (`single-${firstPhoto.orientation || 'landscape'}` as WallZoneOverrideKey)
                : layout;

        return {
            ...baseZone,
            ...(baseZone.overrides?.[layoutKey] || baseZone.overrides?.[layout] || {}),
        };
    }, [environment, layout, slots]);

    const stageTransition = shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.5, ease: 'easeOut' as const };

    return (
        <div className="flex-1 relative overflow-hidden flex flex-col h-full w-full bg-neutral-900">
            <div
                className={cn('absolute', !shouldReduceMotion && 'transition-all duration-700 ease-in-out')}
                style={{
                    width: `${baseW}px`,
                    height: `${baseH}px`,
                    transformOrigin: 'top left',
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                }}
            >
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={environment}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
                            className="absolute inset-0"
                        >
                            {cloudinaryCloudName ? (
                                <CldImage
                                    src={ENV_BACKGROUNDS[environment].id}
                                    alt={`Gallery Environment - ${environment}`}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                />
                            ) : (
                                <Image
                                    src={ENV_BACKGROUNDS[environment].fallback}
                                    alt={`Gallery Environment - ${environment}`}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div
                        className={cn(
                            'absolute inset-0',
                            !shouldReduceMotion && 'transition-colors duration-700',
                            environment === 'home' && 'bg-[#5c4d3c]/20 mix-blend-overlay',
                            environment === 'office' && 'bg-blue-900/10 mix-blend-overlay'
                        )}
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none z-[1]" />

                <div
                    ref={setCanvasDropRef}
                    className={cn('absolute z-10', !shouldReduceMotion && 'transition-all duration-700 ease-in-out')}
                    style={{
                        top: currentZone.top,
                        left: currentZone.left,
                        width: currentZone.width,
                        height: currentZone.height,
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${layout}-${environment}`}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={stageTransition}
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
                                        frameStyles={frameStyles}
                                        matClasses={matClasses}
                                        colSpan={colSpan}
                                        performanceMode={isPerformanceMode}
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
