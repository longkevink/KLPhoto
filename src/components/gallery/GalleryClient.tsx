'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import {
    FrameStyle,
    GalleryEnvironment,
    GalleryViewMode,
    LayoutTemplate,
    MatOption,
    PhotoCard,
    PhotoCategory,
} from '@/content/types';
import PhotoPicker from './PhotoPicker';
import WallConfigurator from './WallConfigurator';
import { Grid3X3, Maximize2, X } from 'lucide-react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useAdaptiveMotion } from '@/lib/useAdaptiveMotion';
import { GalleryBottomToolbar } from './GalleryBottomToolbar';
import { GalleryDetailsPanel } from './GalleryDetailsPanel';
import { GalleryTopToolbar } from './GalleryTopToolbar';
import { DEFAULT_TRANSFORMS, EMPTY_SLOTS, ENVIRONMENTS, getSlotCount, LAYOUTS } from './gallery.constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { DEFAULT_ETSY_URL } from '@/config/purchase';

interface GalleryClientProps {
    photosGrouped: Record<PhotoCategory, PhotoCard[]>;
}

export default function GalleryClient({ photosGrouped }: GalleryClientProps) {
    const [isPending, startTransition] = useTransition();
    const shouldReduceMotion = useAdaptiveMotion();

    const [environment, setEnvironment] = useState<GalleryEnvironment>('home');
    const [layout, setLayout] = useState<LayoutTemplate>('single');
    const [frameStyle, setFrameStyle] = useState<FrameStyle>('thin-black');
    const [matOption, setMatOption] = useState<MatOption>('white');
    const [activeSlotIndex, setActiveSlotIndex] = useState(0);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
    const [slots, setSlots] = useState<(PhotoCard | null)[]>(() => [...EMPTY_SLOTS]);
    const [activeDragPhoto, setActiveDragPhoto] = useState<PhotoCard | null>(null);

    const [dimensions, setDimensions] = useState({
        width: typeof window === 'undefined' ? 1440 : window.innerWidth,
        height: typeof window === 'undefined' ? 900 : window.innerHeight,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let frame = 0;
        const handleResize = () => {
            cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => {
                const nextWidth = window.innerWidth;
                const nextHeight = window.innerHeight;

                // Mobile browsers fire resize events while the URL bar animates.
                // Ignore pure height churn on mobile to prevent expensive rerenders.
                setDimensions((prev) => {
                    const nextIsDesktop = nextWidth >= 1024;
                    if (!nextIsDesktop && prev.width === nextWidth) {
                        return prev;
                    }
                    if (nextIsDesktop && prev.width === nextWidth && prev.height === nextHeight) {
                        return prev;
                    }
                    return {
                        width: nextWidth,
                        height: nextHeight,
                    };
                });
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const viewMode: GalleryViewMode = dimensions.width < 1024 ? 'mobile-guided' : 'desktop';
    const isDesktop = viewMode === 'desktop';

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const currentSlotCount = getSlotCount(layout);
    const visibleSlots = useMemo(() => slots.slice(0, currentSlotCount), [slots, currentSlotCount]);
    const selectedPhoto = visibleSlots[activeSlotIndex] || null;

    const sidebarWidth = 320;
    const activeSidebarsWidth = isDesktop ? (leftSidebarOpen ? sidebarWidth : 0) + (rightSidebarOpen ? sidebarWidth : 0) : 0;
    const workspaceWidth = isDesktop
        ? Math.max(640, dimensions.width - activeSidebarsWidth)
        : Math.max(360, dimensions.width);
    const workspaceHeight = isDesktop
        ? Math.max(560, dimensions.height - 64)
        : Math.max(320, Math.round(dimensions.height * 0.52));

    const activeTransform = DEFAULT_TRANSFORMS[environment][layout];
    const isPerformanceMode = Boolean(activeDragPhoto) || isPending || shouldReduceMotion;
    const selectedEtsyUrl = DEFAULT_ETSY_URL;

    const handleLayoutChange = useCallback(
        (newLayout: LayoutTemplate) => {
            startTransition(() => {
                setLayout(newLayout);
                setActiveSlotIndex(0);
            });
        },
        [startTransition]
    );

    const handleEnvironmentChange = useCallback(
        (nextEnvironment: GalleryEnvironment) => {
            startTransition(() => setEnvironment(nextEnvironment));
        },
        [startTransition]
    );

    const handleFrameStyleChange = useCallback(
        (nextFrameStyle: FrameStyle) => {
            startTransition(() => setFrameStyle(nextFrameStyle));
        },
        [startTransition]
    );

    const handleMatOptionChange = useCallback(
        (nextMatOption: MatOption) => {
            startTransition(() => setMatOption(nextMatOption));
        },
        [startTransition]
    );

    const handlePhotoSelect = useCallback(
        (photo: PhotoCard) => {
            setSlots((previous) => {
                const next = [...previous];
                next[activeSlotIndex] = photo;

                const nextEmpty = next.findIndex((slot, index) => index < currentSlotCount && !slot && index !== activeSlotIndex);
                if (nextEmpty !== -1) {
                    setActiveSlotIndex(nextEmpty);
                }

                return next;
            });
        },
        [activeSlotIndex, currentSlotCount]
    );

    const handleClearLayout = useCallback(() => {
        setSlots([...EMPTY_SLOTS]);
        setActiveSlotIndex(0);
    }, []);

    const handleClearSlot = useCallback((index: number) => {
        setSlots((previous) => {
            const next = [...previous];
            next[index] = null;
            return next;
        });
    }, []);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        if (!isDesktop) return;
        const photo = event.active.data.current as PhotoCard | undefined;
        if (photo) {
            setActiveDragPhoto(photo);
        }
    }, [isDesktop]);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            setActiveDragPhoto(null);
            if (!isDesktop) return;

            const { active, over } = event;
            if (!over || !active.data.current) return;

            const photo = active.data.current as PhotoCard;
            const overId = String(over.id);

            setSlots((previous) => {
                const next = [...previous];

                if (overId.startsWith('slot-')) {
                    const slotIndex = Number.parseInt(overId.replace('slot-', ''), 10);
                    if (!Number.isNaN(slotIndex)) {
                        next[slotIndex] = photo;
                        setActiveSlotIndex(slotIndex);
                        return next;
                    }
                }

                if (overId === 'wall-canvas') {
                    if (!next[activeSlotIndex]) {
                        next[activeSlotIndex] = photo;
                    } else {
                        const nextEmpty = next.findIndex((slot, index) => index < currentSlotCount && !slot);
                        if (nextEmpty !== -1) {
                            next[nextEmpty] = photo;
                            setActiveSlotIndex(nextEmpty);
                        } else {
                            next[activeSlotIndex] = photo;
                        }
                    }
                }

                return next;
            });
        },
        [activeSlotIndex, currentSlotCount, isDesktop]
    );


    if (isDesktop) {
        return (
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex h-[calc(100vh-64px)] pt-[64px] bg-background overflow-hidden font-sans relative">
                    <div
                        className={cn(
                            'fixed inset-y-0 left-0 pt-[64px] z-40 transition-transform duration-500 ease-in-out lg:relative lg:pt-0',
                            leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        )}
                    >
                        <PhotoPicker
                            photosGrouped={photosGrouped}
                            onPhotoSelect={handlePhotoSelect}
                            performanceMode={isPerformanceMode}
                        />

                        <button
                            onClick={() => setLeftSidebarOpen(false)}
                            className="absolute top-[80px] right-4 p-2 bg-neutral-900 text-white rounded-full lg:hidden tap-target"
                            aria-label="Close collections"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {!leftSidebarOpen && (
                        <button
                            onClick={() => setLeftSidebarOpen(true)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 transition-all tap-target"
                            title="Open Collections"
                            aria-label="Open collections"
                        >
                            <Grid3X3 size={20} />
                        </button>
                    )}

                    <div className="flex-1 relative z-0 bg-neutral-900">
                        <GalleryTopToolbar
                            environment={environment}
                            layout={layout}
                            onEnvironmentChange={handleEnvironmentChange}
                            onLayoutChange={handleLayoutChange}
                            onClearLayout={handleClearLayout}
                            disableMotion={isPerformanceMode}
                        />

                        <div className="absolute inset-0 z-0">
                            <WallConfigurator
                                environment={environment}
                                layout={layout}
                                frameStyle={frameStyle}
                                matOption={matOption}
                                slots={visibleSlots}
                                activeSlotIndex={activeSlotIndex}
                                onSlotClick={setActiveSlotIndex}
                                onClearSlot={handleClearSlot}
                                transform={activeTransform}
                                workspaceWidth={workspaceWidth}
                                workspaceHeight={workspaceHeight}
                                isPerformanceMode={isPerformanceMode}
                            />
                        </div>

                        <GalleryBottomToolbar
                            frameStyle={frameStyle}
                            matOption={matOption}
                            onFrameStyleChange={handleFrameStyleChange}
                            onMatOptionChange={handleMatOptionChange}
                            disableMotion={isPerformanceMode}
                        />

                        {!rightSidebarOpen && (
                            <button
                                onClick={() => setRightSidebarOpen(true)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 transition-all tap-target"
                                title="Open Details"
                                aria-label="Open details"
                            >
                                <Maximize2 size={20} />
                            </button>
                        )}
                    </div>

                    <GalleryDetailsPanel
                        selectedPhoto={selectedPhoto}
                        rightSidebarOpen={rightSidebarOpen}
                        onCloseSidebar={() => setRightSidebarOpen(false)}
                    />
                </div>
                <DragOverlay dropAnimation={null} zIndex={100}>
                    {activeDragPhoto ? (
                        <div
                            className={cn(
                                'relative w-32 rounded-lg overflow-hidden shadow-2xl ring-2 ring-white',
                                activeDragPhoto.orientation === 'landscape' ? 'aspect-[3/2]' : 'aspect-[2/3]'
                            )}
                        >
                            {activeDragPhoto.cloudinaryId ? (
                                <CldImage
                                    src={activeDragPhoto.cloudinaryId}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                    loading="eager"
                                />
                            ) : (
                                <Image
                                    src={activeDragPhoto.src}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                    loading="eager"
                                />
                            )}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        );
    }

    return (
        <div className="min-h-screen-safe pt-[64px] bg-background text-foreground">
            <section className="space-y-4 px-4 pt-4 pb-4">
                <div>
                    <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">Environment</p>
                    <div className="grid grid-cols-3 gap-2">
                        {ENVIRONMENTS.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => handleEnvironmentChange(id)}
                                className={cn(
                                    'tap-target rounded-xl border px-2 py-2 text-[11px] uppercase tracking-wide text-center',
                                    environment === id
                                        ? 'border-black bg-black text-white'
                                        : 'border-neutral-200 bg-white text-neutral-700'
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">Layout</p>
                    <div className="grid grid-cols-3 gap-2">
                        {LAYOUTS.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => handleLayoutChange(id)}
                                className={cn(
                                    'tap-target rounded-xl border px-2 py-2 text-[11px] uppercase tracking-wide text-center',
                                    layout === id
                                        ? 'border-black bg-black text-white'
                                        : 'border-neutral-200 bg-white text-neutral-700'
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="sticky top-[64px] z-20 px-4 pb-4 bg-background border-b border-border">
                <div className="relative w-full aspect-[3/2] max-h-[60vh] rounded-2xl overflow-hidden bg-neutral-900">
                    <WallConfigurator
                        environment={environment}
                        layout={layout}
                        frameStyle={frameStyle}
                        matOption={matOption}
                        slots={visibleSlots}
                        activeSlotIndex={activeSlotIndex}
                        onSlotClick={setActiveSlotIndex}
                        onClearSlot={handleClearSlot}
                        transform={activeTransform}
                        workspaceWidth={Math.max(320, dimensions.width - 24)}
                        workspaceHeight={Math.round(Math.max(320, dimensions.width - 24) * (2 / 3))}
                        isPerformanceMode
                    />
                </div>
            </section>

            <section className="px-4 pt-4 pb-36">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-widest text-neutral-500">Photos</p>
                    <button
                        onClick={handleClearLayout}
                        className="tap-target text-[11px] uppercase tracking-widest text-neutral-500 underline underline-offset-4"
                    >
                        Reset
                    </button>
                </div>

                {currentSlotCount > 1 && (
                    <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">
                        {visibleSlots.map((slot, index) => (
                            <button
                                key={`mobile-slot-${index}`}
                                onClick={() => setActiveSlotIndex(index)}
                                className={cn(
                                    'tap-target px-3 py-2 rounded-full text-[11px] uppercase tracking-wide border shrink-0',
                                    index === activeSlotIndex
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-neutral-500 border-neutral-200'
                                )}
                            >
                                Slot {index + 1}{slot ? ' *' : ''}
                            </button>
                        ))}
                    </div>
                )}

                <PhotoPicker
                    photosGrouped={photosGrouped}
                    onPhotoSelect={handlePhotoSelect}
                    performanceMode
                    compact
                    className="max-h-none"
                />

                <div className="mt-4">
                    <GalleryBottomToolbar
                        frameStyle={frameStyle}
                        matOption={matOption}
                        onFrameStyleChange={handleFrameStyleChange}
                        onMatOptionChange={handleMatOptionChange}
                        disableMotion
                        compact
                    />
                </div>
            </section>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur px-4 py-3">
                <button
                    onClick={() => setMobileDetailsOpen(true)}
                    className="tap-target w-full rounded-xl border border-neutral-200 px-3 py-2 text-left bg-white mb-2"
                >
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500">Selected Photo</p>
                    <p className="font-serif text-base text-neutral-900 truncate">{selectedPhoto?.title || 'No photo selected yet'}</p>
                </button>
                <Button
                    className="w-full bg-[#F1641E] hover:bg-[#d95616] text-white rounded-xl h-11 text-xs font-bold tracking-wide uppercase"
                    onClick={() => window.open(selectedEtsyUrl, '_blank')}
                >
                    Continue to Etsy
                </Button>
            </div>

            <GalleryDetailsPanel
                selectedPhoto={selectedPhoto}
                rightSidebarOpen={mobileDetailsOpen}
                onCloseSidebar={() => setMobileDetailsOpen(false)}
                mobile
            />
        </div>
    );
}
