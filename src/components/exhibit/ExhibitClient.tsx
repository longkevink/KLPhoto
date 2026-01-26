'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Photo, PhotoCategory } from '@/content/types';
import FilmStrip from './FilmStrip';
import SpotlightModal from './SpotlightModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ExhibitClientProps {
    photosByCategory: Record<PhotoCategory, Photo[]>;
    initialSpotlightPhoto: Photo | null;
}

export default function ExhibitClient({ photosByCategory, initialSpotlightPhoto }: ExhibitClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categories: PhotoCategory[] = ['street', 'travel'];

    const [activeCategory, setActiveCategory] = useState<PhotoCategory>('street');
    const [spotlightPhoto, setSpotlightPhoto] = useState<Photo | null>(initialSpotlightPhoto);
    const [isModalOpen, setIsModalOpen] = useState(!!initialSpotlightPhoto);

    // Sync state with URL params if they change externally (e.g. back button)
    useEffect(() => {
        const photoId = searchParams.get('photo');
        if (!photoId && isModalOpen) {
            setIsModalOpen(false);
            // Wait for animation to finish before clearing data? 
            // Actually closer to instant creates less ghosting, but we can delay slightly in a real app.
            // For now, instant sync.
            setTimeout(() => setSpotlightPhoto(null), 300);
        }
    }, [searchParams, isModalOpen]);

    const handlePhotoClick = (photo: Photo) => {
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
        <div className="min-h-screen pt-24 pb-20">
            {/* Header */}
            <header className="text-center px-8 mb-12">
                <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-4">Exhibit</h1>
                <p className="text-gray-500 font-light tracking-wide">
                    Explore collections through a film-strip experience
                </p>
            </header>

            {/* Category Tabs */}
            <nav
                className="flex justify-center gap-8 md:gap-16 mb-16 border-b border-gray-100 pb-px"
                aria-label="Category navigation"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={cn(
                            "pb-4 text-sm uppercase tracking-widest transition-all duration-300 relative",
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
            <div className="min-h-[60vh] flex flex-col justify-center">
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
                        transition={{ duration: 0.5, ease: "easeOut" }}
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
