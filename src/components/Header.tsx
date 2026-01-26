'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    // Update header state based on scroll position - threshold 20px
    useMotionValueEvent(scrollY, 'change', (latest) => {
        const scrolled = latest > 20;
        if (scrolled !== isScrolled) {
            setIsScrolled(scrolled);
        }
    });

    const links = [
        { href: '/', label: 'Home' },
        { href: '/exhibit', label: 'Exhibit' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/links', label: 'Links' },
    ];

    return (
        <motion.header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
                isScrolled
                    ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-sm'
                    : 'bg-transparent py-6'
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo / Home Link */}
                <Link
                    href="/"
                    className="font-serif text-2xl tracking-premium-tight z-50 text-foreground hover:opacity-70 transition-opacity"
                >
                    Kevin Long
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-[13px] font-medium tracking-ultra-wide uppercase transition-colors relative',
                                    isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-foreground"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Nav Placeholder */}
                <div className="md:hidden">
                    <button className="text-foreground p-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.header>
    );
}
