'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { PhotoCard, PhotoCategory, PhotoDetail } from '@/content/types';
import FilmStrip from './FilmStrip';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptiveMotion } from '@/lib/useAdaptiveMotion';

const SpotlightModal = dynamic(() => import('./SpotlightModal'), { ssr: false });

interface ExhibitClientProps {
    photosByCategory: Record<PhotoCategory, PhotoCard[]>;
    initialSpotlightPhoto: PhotoDetail | null;
}

export default function ExhibitClient({ photosByCategory, initialSpotlightPhoto }: ExhibitClientProps) {
    const searchParams = useSearchParams();
    const shouldReduceMotion = useAdaptiveMotion();

    const categories: PhotoCategory[] = ['travel', 'moments', 'street'];

    const [activeCategory, setActiveCategory] = useState<PhotoCategory>('travel');
    const [spotlightPhoto, setSpotlightPhoto] = useState<PhotoCard | PhotoDetail | null>(initialSpotlightPhoto);
    const [isModalOpen, setIsModalOpen] = useState(!!initialSpotlightPhoto);

    // Sync state with URL params if they change externally (e.g. back button)
    useEffect(() => {
        const photoId = searchParams.get('photo');

        // If the URL has no photo ID but the modal is open, it means the user hit 'back'
        if (!photoId && isModalOpen) {
            // Using setTimeout to avoid synchronous setState inside useEffect warning
            const timer = setTimeout(() => {
                setIsModalOpen(false);
                setTimeout(() => setSpotlightPhoto(null), 300);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [searchParams, isModalOpen]);


    const handlePhotoClick = (photo: PhotoCard) => {
        setSpotlightPhoto(photo);
        setIsModalOpen(true);
        // Push state without reloading
        window.history.pushState(null, '', `/exhibit?photo=${photo.id}`);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Remove query param
        window.history.pushState(null, '', `/exhibit`);
        // Wait for exit animation
        setTimeout(() => setSpotlightPhoto(null), 300);
    };

    const handleCategoryChange = (category: PhotoCategory) => {
        setActiveCategory(category);
    };

    return (
        <div className="min-h-screen-safe pt-18 md:pt-20 pb-8 md:pb-10">
            {/* Header */}
            <header className="text-center px-4 md:px-8 mb-4 md:mb-6">
                <h1 className="font-serif text-[clamp(2rem,9vw,3.2rem)] tracking-tight mb-2">Exhibit</h1>
            </header>

            {/* Category Tabs */}
            <nav
                className="flex justify-center gap-3 md:gap-12 mb-6 md:mb-8 border-b border-gray-100 pb-px px-2 overflow-x-auto"
                aria-label="Category navigation"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={cn(
                            "pb-2 px-2 md:px-0 text-[11px] md:text-xs uppercase tracking-widest transition-all duration-300 relative tap-target",
                            activeCategory === category
                                ? "text-black font-medium"
                                : "text-gray-400 hover:text-gray-800"
                        )}
                    >
                        {category}
                        {activeCategory === category && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-px bg-black"
                            />
                        )}
                    </button>
                ))}
            </nav>

            {/* Film Strip Content area */}
            <div className="flex-grow flex flex-col justify-center">
                {/* We render all strips but only show active to preserve state/scroll position if desired, 
            OR we enforce unmount for clean entrance animations. 
            Let's use AnimatePresence mode="wait" for clean transitions between categories. 
        */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
                    >
                        <FilmStrip
                            photos={photosByCategory[activeCategory]}
                            isActive={true}
                            onPhotoClick={handlePhotoClick}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Spotlight Modal */}
            <SpotlightModal
                photo={spotlightPhoto}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
