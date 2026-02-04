'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { PhotoCard, PhotoCategory, GalleryEnvironment, LayoutTemplate, FrameStyle, MatOption } from '@/content/types';
import PhotoPicker from './PhotoPicker';
import WallConfigurator from './WallConfigurator';
import { Grid3X3, Maximize2, X } from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragEndEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import { useAdaptiveMotion } from '@/lib/useAdaptiveMotion';
import { GalleryBottomToolbar } from './GalleryBottomToolbar';
import { GalleryDetailsPanel } from './GalleryDetailsPanel';
import { GalleryTopToolbar } from './GalleryTopToolbar';
import { DEFAULT_TRANSFORMS, EMPTY_SLOTS, getSlotCount } from './gallery.constants';
import { cn } from '@/lib/utils';

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
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            });
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const currentSlotCount = getSlotCount(layout);
    const visibleSlots = useMemo(() => slots.slice(0, currentSlotCount), [slots, currentSlotCount]);
    const selectedPhoto = visibleSlots[activeSlotIndex] || null;

    const sidebarWidth = 320;
    const activeSidebarsWidth = (leftSidebarOpen ? sidebarWidth : 0) + (rightSidebarOpen ? sidebarWidth : 0);
    const workspaceWidth = Math.max(640, dimensions.width - activeSidebarsWidth);
    const workspaceHeight = Math.max(560, dimensions.height - 64);

    const activeTransform = DEFAULT_TRANSFORMS[environment][layout];
    const isPerformanceMode = Boolean(activeDragPhoto) || isPending || shouldReduceMotion;

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
        const photo = event.active.data.current as PhotoCard | undefined;
        if (photo) {
            setActiveDragPhoto(photo);
        }
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            setActiveDragPhoto(null);

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
        [activeSlotIndex, currentSlotCount]
    );

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
                        className="absolute top-[80px] right-4 p-2 bg-neutral-900 text-white rounded-full lg:hidden"
                    >
                        <X size={16} />
                    </button>
                </div>

                {!leftSidebarOpen && (
                    <button
                        onClick={() => setLeftSidebarOpen(true)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 transition-all"
                        title="Open Collections"
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
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 transition-all"
                            title="Open Details"
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
