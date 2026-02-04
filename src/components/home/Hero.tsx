'use client';

import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { PhotoCard } from '@/content/types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeInUp, fadeIn } from '@/lib/motion';
import { cloudinaryCloudName } from '@/lib/cloudinary';
import { useAdaptiveMotion } from '@/lib/useAdaptiveMotion';

interface HeroProps {
    photo?: PhotoCard;
}

export default function Hero({ photo }: HeroProps) {
    const { scrollY } = useScroll();
    const shouldReduceMotion = useAdaptiveMotion();

    // Parallax effect for the text layer
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section
            className="relative flex min-h-screen-safe w-full items-center justify-center overflow-hidden bg-background"
            aria-label="Hero"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {photo ? (
                    <>
                        <motion.div
                            className="relative w-full h-full"
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut" }}
                        >
                            {photo.cloudinaryId && cloudinaryCloudName ? (
                                <CldImage
                                    src={photo.cloudinaryId}
                                    alt={photo.alt}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                />
                            ) : (
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                />
                            )}
                        </motion.div>
                        {/* Overlay for text readability */}
                        <div className="absolute inset-0 bg-black/20" />
                    </>
                ) : (
                    <motion.div
                        className="absolute inset-0 bg-background"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.5 }}
                    />
                )}
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 text-center px-4 md:px-6"
                style={{ y, opacity }}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <motion.h1
                    className="font-serif text-[clamp(2.8rem,14vw,10rem)] tracking-[0.12em] md:tracking-ultra-wide text-white mb-3 md:mb-4 leading-[0.9] uppercase drop-shadow-md"
                    layoutId="heroTitle"
                >
                    Kevin Long
                </motion.h1>

                <motion.p
                    className="text-fluid-sm md:text-base font-medium text-white/90 uppercase tracking-[0.08em] md:tracking-ultra-wide font-sans mt-6 md:mt-8 drop-shadow-md"
                    variants={fadeIn}
                >
                    Travel, Moments, & Street Photography
                </motion.p>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-border transform"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            >
                <span className="sr-only">Scroll down</span>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
            </motion.div>
        </section>
    );
}
