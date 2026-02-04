'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import {
    FrameStyle,
    GalleryEnvironment,
    GalleryMobileStep,
    GalleryViewMode,
    LayoutTemplate,
    MatOption,
    PhotoCard,
    PhotoCategory,
} from '@/content/types';
import PhotoPicker from './PhotoPicker';
import WallConfigurator from './WallConfigurator';
import { ArrowLeft, ArrowRight, Grid3X3, Maximize2, X } from 'lucide-react';
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

const MOBILE_STEPS: GalleryMobileStep[] = ['photo', 'environment', 'layout', 'style', 'purchase'];

const MOBILE_STEP_COPY: Record<GalleryMobileStep, string> = {
    photo: 'Pick a photo and place it in the active slot.',
    environment: 'Choose a room to preview your print placement.',
    layout: 'Select a wall layout that fits your space.',
    style: 'Fine-tune frame and mat options.',
    purchase: 'Review your selection and continue to checkout.',
};

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
    const [mobileStep, setMobileStep] = useState<GalleryMobileStep>('photo');

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

    const currentStepIndex = MOBILE_STEPS.indexOf(mobileStep);
    const hasNextStep = currentStepIndex < MOBILE_STEPS.length - 1;
    const hasPreviousStep = currentStepIndex > 0;

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

    const goToNextStep = () => {
        if (!hasNextStep) return;
        setMobileStep(MOBILE_STEPS[currentStepIndex + 1]);
    };

    const goToPreviousStep = () => {
        if (!hasPreviousStep) return;
        setMobileStep(MOBILE_STEPS[currentStepIndex - 1]);
    };

    const renderMobileStepControls = () => {
        if (mobileStep === 'photo') {
            return (
                <div className="space-y-4">
                    {currentSlotCount > 1 && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {visibleSlots.map((slot, index) => (
                                <button
                                    key={`slot-switcher-${index}`}
                                    onClick={() => setActiveSlotIndex(index)}
                                    className={cn(
                                        'tap-target px-3 py-2 rounded-full text-xs uppercase tracking-wide border',
                                        index === activeSlotIndex
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-neutral-500 border-neutral-200'
                                    )}
                                >
                                    Slot {index + 1}
                                    {slot ? ' ✓' : ''}
                                </button>
                            ))}
                        </div>
                    )}
                    <PhotoPicker
                        photosGrouped={photosGrouped}
                        onPhotoSelect={handlePhotoSelect}
                        performanceMode={isPerformanceMode}
                        compact
                        className="max-h-[42svh]"
                    />
                </div>
            );
        }

        if (mobileStep === 'environment') {
            return (
                <div className="grid grid-cols-1 gap-2">
                    {ENVIRONMENTS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => handleEnvironmentChange(id)}
                            className={cn(
                                'tap-target flex items-center gap-3 rounded-xl border px-4 py-3 text-left',
                                environment === id ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-700'
                            )}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
            );
        }

        if (mobileStep === 'layout') {
            return (
                <div className="grid grid-cols-1 gap-2">
                    {LAYOUTS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => handleLayoutChange(id)}
                            className={cn(
                                'tap-target flex items-center gap-3 rounded-xl border px-4 py-3 text-left',
                                layout === id ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white text-neutral-700'
                            )}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
            );
        }

        if (mobileStep === 'style') {
            return (
                <GalleryBottomToolbar
                    frameStyle={frameStyle}
                    matOption={matOption}
                    onFrameStyleChange={handleFrameStyleChange}
                    onMatOptionChange={handleMatOptionChange}
                    disableMotion={isPerformanceMode}
                    compact
                />
            );
        }

        return (
            <div className="space-y-3">
                <button
                    onClick={() => setMobileDetailsOpen(true)}
                    className="tap-target w-full rounded-xl border border-neutral-200 px-4 py-3 text-left bg-white"
                >
                    <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Selected Photo</p>
                    <p className="font-serif text-lg text-neutral-900">{selectedPhoto?.title || 'No photo selected yet'}</p>
                </button>
                <Button
                    className="w-full bg-[#F1641E] hover:bg-[#d95616] text-white rounded-xl h-12 text-sm font-bold tracking-wide"
                    onClick={() => window.open(selectedEtsyUrl, '_blank')}
                >
                    Continue to Etsy
                </Button>
            </div>
        );
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {isDesktop ? (
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
            ) : (
                <div className="min-h-screen-safe pt-[64px] bg-background text-foreground">
                    <section className="relative h-[52svh] bg-neutral-900">
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
                    </section>

                    <section className="relative z-20 -mt-5 rounded-t-3xl bg-background px-4 pb-28 pt-5 border-t border-border">
                        <div className="mb-4">
                            <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">
                                Step {currentStepIndex + 1} of {MOBILE_STEPS.length}
                            </p>
                            <h2 className="font-serif text-2xl mb-1 capitalize">{mobileStep.replace('-', ' ')}</h2>
                            <p className="text-sm text-neutral-500">{MOBILE_STEP_COPY[mobileStep]}</p>
                        </div>

                        {mobileStep === 'style' ? (
                            <div className="space-y-4">
                                {renderMobileStepControls()}
                                <button
                                    onClick={handleClearLayout}
                                    className="tap-target text-sm text-neutral-500 underline underline-offset-4"
                                >
                                    Reset all selected slots
                                </button>
                            </div>
                        ) : (
                            renderMobileStepControls()
                        )}
                    </section>

                    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl h-11 text-xs uppercase tracking-wide"
                                onClick={goToPreviousStep}
                                disabled={!hasPreviousStep}
                            >
                                <ArrowLeft size={14} className="mr-2" />
                                Back
                            </Button>
                            <Button
                                className="flex-1 rounded-xl h-11 text-xs uppercase tracking-wide"
                                onClick={goToNextStep}
                                disabled={!hasNextStep}
                            >
                                Next
                                <ArrowRight size={14} className="ml-2" />
                            </Button>
                        </div>
                    </div>

                    <GalleryDetailsPanel
                        selectedPhoto={selectedPhoto}
                        rightSidebarOpen={mobileDetailsOpen}
                        onCloseSidebar={() => setMobileDetailsOpen(false)}
                        mobile
                    />
                </div>
            )}

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
