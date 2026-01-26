'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo, PhotoCategory, GalleryEnvironment, LayoutTemplate, FrameStyle, MatOption } from '@/content/types';
import PhotoPicker from './PhotoPicker';
import WallConfigurator from './WallConfigurator';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface GalleryClientProps {
    photosGrouped: Record<PhotoCategory, Photo[]>;
}

export default function GalleryClient({ photosGrouped }: GalleryClientProps) {
    // State
    const [environment, setEnvironment] = useState<GalleryEnvironment>('home');
    const [layout, setLayout] = useState<LayoutTemplate>('single');
    const [frameStyle, setFrameStyle] = useState<FrameStyle>('thin-black');
    const [matOption, setMatOption] = useState<MatOption>('white');
    const [activeSlotIndex, setActiveSlotIndex] = useState(0);

    // Layout Slot Logic
    const getSlotCount = (l: LayoutTemplate) => {
        switch (l) {
            case 'single': return 1;
            case 'gallery-6': return 6;
            case 'collage-5': return 5;
            case 'collage-7': return 7;
            case 'collage-9': return 9;
            default: return 1;
        }
    };

    const [slots, setSlots] = useState<(Photo | null)[]>(Array(9).fill(null));

    const currentSlotCount = getSlotCount(layout);
    const visibleSlots = slots.slice(0, currentSlotCount);
    const selectedPhoto = visibleSlots[activeSlotIndex] || null;

    const handleLayoutChange = (newLayout: LayoutTemplate) => {
        setLayout(newLayout);
        setActiveSlotIndex(0);
    };

    const handlePhotoSelect = (photo: Photo) => {
        const newSlots = [...slots];
        newSlots[activeSlotIndex] = photo;
        setSlots(newSlots);

        // Auto-advance
        const nextEmpty = newSlots.findIndex((s, i) => i < currentSlotCount && !s && i !== activeSlotIndex);
        if (nextEmpty !== -1) {
            setActiveSlotIndex(nextEmpty);
        } else {
            setActiveSlotIndex((prev) => (prev + 1) % currentSlotCount);
        }
    };

    const handleClearLayout = () => {
        setSlots(Array(9).fill(null));
        setActiveSlotIndex(0);
    };

    const environments: GalleryEnvironment[] = ['home', 'office', 'business'];
    const layouts: LayoutTemplate[] = ['single', 'gallery-6', 'collage-5', 'collage-7', 'collage-9'];
    const frames: FrameStyle[] = ['thin-black', 'thin-white', 'natural-wood'];
    const mats: MatOption[] = ['none', 'white'];

    return (
        <div className="flex h-[calc(100vh-64px)] pt-[64px] bg-white overflow-hidden">
            {/* Left Rail */}
            <PhotoPicker photosGrouped={photosGrouped} onPhotoSelect={handlePhotoSelect} />

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col relative z-0">
                {/* Toolbar */}
                <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between shadow-sm z-20">
                    <div className="flex items-center gap-6">
                        {/* Env Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Env</span>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {environments.map(env => (
                                    <button
                                        key={env}
                                        onClick={() => setEnvironment(env)}
                                        className={cn(
                                            "px-3 py-1 text-xs capitalize rounded-md transition-all",
                                            environment === env ? "bg-white shadow-sm font-medium text-black" : "text-gray-500 hover:text-gray-800"
                                        )}
                                    >
                                        {env}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-6 bg-gray-200" />

                        {/* Layout Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Layout</span>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {layouts.map(l => (
                                    <button
                                        key={l}
                                        onClick={() => handleLayoutChange(l)}
                                        className={cn(
                                            "px-3 py-1 text-xs capitalize rounded-md transition-all",
                                            layout === l ? "bg-white shadow-sm font-medium text-black" : "text-gray-500 hover:text-gray-800"
                                        )}
                                    >
                                        {l === 'single' ? 'Single' : l.replace('gallery-', 'Grid ').replace('collage-', 'Collage ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={handleClearLayout}>
                        Clear Layout
                    </Button>
                </div>

                {/* Visualizer */}
                <WallConfigurator
                    environment={environment}
                    layout={layout}
                    frameStyle={frameStyle}
                    matOption={matOption}
                    slots={visibleSlots}
                    activeSlotIndex={activeSlotIndex}
                    onSlotClick={setActiveSlotIndex}
                    onClearSlot={(idx) => {
                        const newSlots = [...slots];
                        newSlots[idx] = null;
                        setSlots(newSlots);
                    }}
                />

                {/* Frame Toolbar (Bottom) */}
                <div className="border-t border-gray-200 bg-white p-4 flex items-center justify-center gap-8 z-20">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frame</span>
                        <div className="flex gap-2">
                            {frames.map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFrameStyle(f)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                                        frameStyle === f ? "ring-2 ring-blue-500 ring-offset-2" : "border-gray-200",
                                        f === 'thin-black' && "bg-black border-gray-800",
                                        f === 'thin-white' && "bg-white border-gray-300",
                                        f === 'natural-wood' && "bg-[#8B5E3C] border-[#6D4C33]"
                                    )}
                                    aria-label={f}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mat</span>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {mats.map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMatOption(m)}
                                    className={cn(
                                        "px-3 py-1 text-xs capitalize rounded-md transition-all",
                                        matOption === m ? "bg-white shadow-sm font-medium text-black" : "text-gray-500 hover:text-gray-800"
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Detail Panel */}
            <aside className="w-72 bg-white border-l border-gray-200 p-6 flex flex-col z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="mb-6">
                    <h2 className="font-serif text-2xl tracking-tight">Active Print</h2>
                    <div className="h-1 w-12 bg-[#F1641E] mt-2" />
                </div>

                {selectedPhoto ? (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="relative aspect-[4/3] w-full bg-gray-100 shadow-sm border border-gray-200">
                            <Image
                                src={selectedPhoto.src}
                                alt={selectedPhoto.alt}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <h3 className="font-serif text-xl">{selectedPhoto.title}</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                {selectedPhoto.category} {selectedPhoto.series && `— ${selectedPhoto.series}`}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                Museum-quality archival print. Available in multiple sizes on the Etsy shop.
                            </p>
                            <Button
                                className="w-full bg-[#F1641E] hover:bg-[#D45719] text-white border-transparent h-12 text-base shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5"
                                onClick={() => window.open(selectedPhoto.etsyUrl, '_blank')}
                            >
                                Buy print on Etsy
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                        <p className="mb-4">Select a slot on the wall to see details</p>
                    </div>
                )}
            </aside>
        </div>
    );
}
