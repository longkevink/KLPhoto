import { Variants } from 'framer-motion';

// Standard fade-in-up animation for entering content
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

// Start hidden but immediately accessible for screen readers if needed
export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
        transition: { duration: 0.5 }
    },
    visible: {
        opacity: 1,
        transition: { duration: 0.8 }
    }
};

// Container that staggers its children
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

// Reveal animation for images (Clip path reveal)
export const imageReveal: Variants = {
    hidden: {
        clipPath: "inset(10% 10% 10% 10%)",
        opacity: 0,
        scale: 1.05
    },
    visible: {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        scale: 1,
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    }
};
