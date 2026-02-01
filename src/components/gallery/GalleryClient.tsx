'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { Photo, PhotoCategory, GalleryEnvironment, LayoutTemplate, FrameStyle, MatOption } from '@/content/types';
import PhotoPicker from './PhotoPicker';
import WallConfigurator from './WallConfigurator';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Maximize2, RotateCcw, Layout, Home, Building2, Briefcase, Square, Grid3X3, X } from 'lucide-react';


interface GalleryClientProps {
    photosGrouped: Record<PhotoCategory, Photo[]>;
}

// --- Wall Position Framework ---
// Defines precise positioning for the wall art grid in each environment 3D space.
interface WallTransform {
    x: number;
    y: number;
    scale: number;
}

const DEFAULT_TRANSFORMS: Record<GalleryEnvironment, Record<LayoutTemplate, WallTransform>> = {
    home: {
        'single': { x: 0, y: 0, scale: 1 },
        'gallery-6': { x: 0, y: 0, scale: 1 },
        'collage-5': { x: 0, y: 0, scale: 1 },
        'collage-7': { x: 0, y: 0, scale: 1 },
        'collage-9': { x: 0, y: 0, scale: 1 },
    },
    office: {
        // "Shifted left to land on the blank white wall space, but kept within screen bounds"
        'single': { x: -280, y: -20, scale: 0.65 },
        'gallery-6': { x: -280, y: -30, scale: 0.80 },
        'collage-5': { x: -260, y: -20, scale: 0.75 },
        'collage-7': { x: -260, y: -20, scale: 0.75 },
        'collage-9': { x: -260, y: -30, scale: 0.7 },
    },
    business: {
        'single': { x: 0, y: 0, scale: 1 },
        'gallery-6': { x: 0, y: 0, scale: 1 },
        'collage-5': { x: 0, y: 0, scale: 1 },
        'collage-7': { x: 0, y: 0, scale: 1 },
        'collage-9': { x: 0, y: 0, scale: 1 },
    }
};

export default function GalleryClient({ photosGrouped }: GalleryClientProps) {
    // State
    const [environment, setEnvironment] = useState<GalleryEnvironment>('home');
    const [layout, setLayout] = useState<LayoutTemplate>('single');
    const [frameStyle, setFrameStyle] = useState<FrameStyle>('thin-black');
    const [matOption, setMatOption] = useState<MatOption>('white');
    const [activeSlotIndex, setActiveSlotIndex] = useState(0);

    // Sidebar Toggles
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    const [transforms] = useState(DEFAULT_TRANSFORMS);
    const [isMounted, setIsMounted] = useState(false);

    // Responsive Scaling Logic
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    });

    useEffect(() => {
        setIsMounted(true);
        const handleResize = () => setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });

        // Set initial dimensions
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarWidth = 320;
    const activeSidebarsWidth = (leftSidebarOpen ? sidebarWidth : 0) + (rightSidebarOpen ? sidebarWidth : 0);
    const workspaceWidth = dimensions.width - activeSidebarsWidth;
    const workspaceHeight = dimensions.height - 64; // Header height


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
            // Optional: loop back or just stay. Let's stay to allow editing.
            // setActiveSlotIndex((prev) => (prev + 1) % currentSlotCount);
        }
    };

    const handleClearLayout = () => {
        setSlots(Array(9).fill(null));
        setActiveSlotIndex(0);
    };

    const environments: { id: GalleryEnvironment; icon: React.ElementType; label: string }[] = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'office', icon: Building2, label: 'Office' },
        { id: 'business', icon: Briefcase, label: 'Business' }, // Renamed from Gallery
    ];


    const layouts: { id: LayoutTemplate; icon: React.ElementType; label: string }[] = [
        { id: 'single', icon: Square, label: 'Single' },
        { id: 'gallery-6', icon: Grid3X3, label: 'Grid' },
        { id: 'collage-5', icon: Layout, label: 'Collage' },
    ];


    // Get current transform for active env/layout
    const activeTransform = transforms[environment][layout];

    // Prevent hydration mismatch by only rendering the interactive canvas after mount
    if (!isMounted) {
        return <div className="flex h-[calc(100vh-64px)] pt-[64px] bg-neutral-900 overflow-hidden font-sans" />;
    }

    return (
        <div className="flex h-[calc(100vh-64px)] pt-[64px] bg-neutral-900 overflow-hidden font-sans relative">
            {/* Left Rail - Dark Themed */}
            <div className={cn(
                "fixed inset-y-0 left-0 pt-[64px] z-40 transition-transform duration-500 ease-in-out lg:relative lg:pt-0",
                leftSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <PhotoPicker photosGrouped={photosGrouped} onPhotoSelect={handlePhotoSelect} />

                {/* Mobile/Tablet Close Button */}
                <button
                    onClick={() => setLeftSidebarOpen(false)}
                    className="absolute top-[80px] right-4 p-2 bg-neutral-900 text-white rounded-full lg:hidden"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Sidebar Toggles (Visible when closed) */}
            {!leftSidebarOpen && (
                <button
                    onClick={() => setLeftSidebarOpen(true)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full shadow-2xl hover:bg-white/20 transition-all"
                    title="Open Collections"
                >
                    <Grid3X3 size={20} />
                </button>
            )}

            {/* Main Canvas Area */}
            <div className="flex-1 relative z-0 bg-neutral-900">

                {/* Floating Top Toolbar */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-white/20 p-2 rounded-full shadow-2xl transition-all duration-300 hover:bg-white/90">

                    {/* Env Selector */}
                    <div className="flex bg-neutral-100/50 rounded-full p-1">
                        {environments.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => setEnvironment(id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full transition-all duration-300",
                                    environment === id
                                        ? "bg-white text-black shadow-sm scale-105"
                                        : "text-neutral-500 hover:text-black hover:bg-white/50"
                                )}
                                title={label}
                            >
                                <Icon size={14} />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-neutral-200" />

                    {/* Layout Selector */}
                    <div className="flex bg-neutral-100/50 rounded-full p-1">
                        {layouts.map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                onClick={() => handleLayoutChange(id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full transition-all duration-300",
                                    layout === id
                                        ? "bg-white text-black shadow-sm scale-105"
                                        : "text-neutral-500 hover:text-black hover:bg-white/50"
                                )}
                                title={label}
                            >
                                <Icon size={14} />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-neutral-200" />

                    <Button variant="ghost" size="icon" onClick={handleClearLayout} className="rounded-full w-8 h-8 hover:bg-red-50 hover:text-red-500 text-neutral-400" title="Clear All">
                        <RotateCcw size={14} />
                    </Button>
                </div>

                {/* Visualizer - Fills container */}
                <div className="absolute inset-0 z-0">
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
                        transform={activeTransform}
                        workspaceWidth={workspaceWidth}
                        workspaceHeight={workspaceHeight}
                    />
                </div>

                {/* Floating Bottom Toolbar (Frames) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 md:gap-8 bg-white/80 backdrop-blur-xl border border-white/20 px-4 md:px-8 py-3 rounded-full shadow-2xl transition-all duration-300 hover:bg-white/90 max-w-[90vw] overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline">Frame</span>
                        <div className="flex items-center gap-2 md:gap-3">
                            <button onClick={() => setFrameStyle('thin-black')} className={cn("w-5 h-5 md:w-6 md:h-6 rounded-full bg-black border border-neutral-200 ring-offset-2 transition-all", frameStyle === 'thin-black' && "ring-2 ring-black scale-110")} title="Black" />
                            <button onClick={() => setFrameStyle('thin-white')} className={cn("w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border border-neutral-200 ring-offset-2 transition-all", frameStyle === 'thin-white' && "ring-2 ring-neutral-300 scale-110")} title="White" />
                            <button onClick={() => setFrameStyle('natural-wood')} className={cn("w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#8B5E3C] border border-neutral-200 ring-offset-2 transition-all", frameStyle === 'natural-wood' && "ring-2 ring-[#8B5E3C] scale-110")} title="Wood" />
                        </div>
                    </div>

                    <div className="w-px h-6 bg-neutral-200 shrink-0" />

                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline">Mat</span>
                        <div className="flex bg-neutral-100/50 rounded-full p-0.5">
                            <button onClick={() => setMatOption('none')} className={cn("px-2 md:px-3 py-1 text-[10px] uppercase font-bold rounded-full transition-all", matOption === 'none' ? "bg-white shadow-sm text-black" : "text-neutral-400 hover:text-black")} >None</button>
                            <button onClick={() => setMatOption('white')} className={cn("px-2 md:px-3 py-1 text-[10px] uppercase font-bold rounded-full transition-all", matOption === 'white' ? "bg-white shadow-sm text-black" : "text-neutral-400 hover:text-black")} >White</button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Toggle (Visible when closed) */}
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

            {/* Right Detail Panel */}
            <aside className={cn(
                "fixed inset-y-0 right-0 pt-[64px] z-40 w-80 bg-white border-l border-neutral-100 p-0 flex flex-col shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-in-out lg:relative lg:pt-0 lg:translate-x-0",
                rightSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Close Button Mobile */}
                <button
                    onClick={() => setRightSidebarOpen(false)}
                    className="absolute top-4 left-4 p-2 bg-neutral-900 text-white rounded-full lg:hidden z-50"
                >
                    <X size={16} />
                </button>
                {selectedPhoto ? (
                    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
                        <div className={cn(
                            "relative w-full bg-neutral-100 overflow-hidden",
                            selectedPhoto.orientation === 'landscape' ? "aspect-[3/2]" : "aspect-[2/3]"
                        )}>
                            {selectedPhoto.cloudinaryId ? (
                                <CldImage
                                    src={selectedPhoto.cloudinaryId}
                                    alt={selectedPhoto.alt}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <Image
                                    src={selectedPhoto.src}
                                    alt={selectedPhoto.alt}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                                <span className="text-white text-xs font-medium tracking-wide">Preview</span>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="mb-6">
                                <h3 className="font-serif text-2xl text-neutral-900 leading-tight">{selectedPhoto.title}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                        {selectedPhoto.category}
                                    </span>
                                    {selectedPhoto.series && (
                                        <span className="text-neutral-400 text-xs">— {selectedPhoto.series}</span>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-neutral-500 leading-relaxed mb-8 flex-1">
                                High-resolution archival pigment print on Hahnemühle Photo Rag 308gsm.
                                Museum quality, designed to last a lifetime without fading.
                            </p>

                            <div className="space-y-3">
                                <Button
                                    className="w-full bg-[#F1641E] hover:bg-[#d95616] text-white rounded-full h-12 text-sm font-bold tracking-wide shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
                                    onClick={() => window.open(selectedPhoto.etsyUrl, '_blank')}
                                >
                                    Purchase Print
                                </Button>
                                <p className="text-center text-[10px] text-neutral-400 uppercase tracking-widest">
                                    Secure checkout via Etsy
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                            <Maximize2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">No Selection</h3>
                            <p className="text-sm text-neutral-500 mt-2 max-w-[200px] mx-auto">
                                Select a photo from the wall to view details and purchasing options.
                            </p>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}
