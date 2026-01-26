'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeInUp, fadeIn } from '@/lib/motion';

export default function Hero() {
    const { scrollY } = useScroll();

    // Parallax effect for the text layer
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section
            className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background"
            aria-label="Hero"
        >
            {/* Background - Gallery White from tokens */}
            <motion.div
                className="absolute inset-0 bg-background"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            />

            {/* Content */}
            <motion.div
                className="relative z-10 text-center px-4"
                style={{ y, opacity }}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <motion.h1
                    className="font-serif text-6xl md:text-8xl lg:text-[10rem] tracking-ultra-wide text-foreground mb-4 leading-[0.9] uppercase"
                    layoutId="heroTitle"
                >
                    Kevin Long
                </motion.h1>

                <motion.p
                    className="text-sm md:text-base font-medium text-muted uppercase tracking-ultra-wide font-sans mt-8"
                    variants={fadeIn}
                >
                    Fine Art & Street Photography
                </motion.p>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-border transform"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
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
