'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Photo } from '@/content/types';
import { isAdminMode } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { cloudinaryCloudName } from '@/lib/cloudinary';

interface SpotlightModalProps {
    photo: Photo | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function SpotlightModal({ photo, isOpen, onClose }: SpotlightModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const showAdminFeatures = isAdminMode();

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Focus trap logic could go here (using a library or custom hook)

    if (!photo) return null;

    // Animation variants based on orientation
    const isLandscape = photo.orientation === 'landscape';

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    const plateVariants = {
        hidden: {
            clipPath: isLandscape
                ? "inset(50% 0 50% 0)" // Center out vertically
                : "inset(0 50% 0 50%)" // Center out horizontally
        },
        visible: {
            clipPath: "inset(0% 0% 0% 0%)",
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
        },
        exit: {
            clipPath: isLandscape
                ? "inset(50% 0 50% 0)"
                : "inset(0 50% 0 50%)",
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 1.02 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { delay: 0.2, duration: 0.5 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-3"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`View ${photo.title}`}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Modal Content - White Plate */}
                    <motion.div
                        ref={modalRef}
                        className="relative bg-white p-1.5 md:p-2 shadow-2xl max-h-[98vh] max-w-[98vw] overflow-hidden"
                        variants={plateVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 text-black md:text-white rounded-full transition-colors mix-blend-difference"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Container */}
                        <motion.div
                            className="relative overflow-hidden bg-gray-100 flex items-center justify-center"
                            style={{
                                maxHeight: '90vh',
                                maxWidth: '96vw',
                                aspectRatio: `${photo.width} / ${photo.height}`
                            }}
                            variants={imageVariants}
                        >
                            {photo.cloudinaryId && cloudinaryCloudName ? (
                                <CldImage
                                    src={photo.cloudinaryId}
                                    alt={photo.alt}
                                    width={photo.width}
                                    height={photo.height}
                                    maxDimension={6000}
                                    className="w-auto h-auto max-w-[96vw] max-h-[90vh] object-contain"
                                    sizes="96vw"
                                    priority
                                />
                            ) : (
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={photo.width}
                                    height={photo.height}
                                    className="w-auto h-auto max-w-[96vw] max-h-[90vh] object-contain"
                                    sizes="96vw"
                                    priority
                                />
                            )}
                        </motion.div>

                        {/* Info Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[#1A1A1A]"
                        >
                            <div>
                                <h2 className="font-serif text-2xl">{photo.title}</h2>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                                    {photo.series ? `${photo.series} — ` : ''}{photo.category}
                                </p>
                            </div>

                            {showAdminFeatures && (
                                <Button
                                    onClick={() => window.open(photo.etsyUrl, '_blank')}
                                    className="bg-[#F1641E] hover:bg-[#D45719] text-white border-transparent"
                                >
                                    Buy print on Etsy
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
