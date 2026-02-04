'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const isHomePage = pathname === '/';
    const isGalleryPage = pathname === '/gallery';
    const scrollThreshold = isHomePage ? 200 : 20;

    useEffect(() => {
        let frame = 0;

        const handleScroll = () => {
            cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > scrollThreshold);
            });
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollThreshold]);

    const isScrolledOrGallery = isScrolled || isGalleryPage;
    const showLogo = isScrolledOrGallery || !isHomePage;

    const links = [
        { href: '/', label: 'Home' },
        { href: '/exhibit', label: 'Exhibit' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/links', label: 'Links' },
    ];

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
                isScrolledOrGallery
                    ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-sm'
                    : 'bg-transparent py-6'
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="w-48 h-8 flex items-center">
                    <div
                        className={cn(
                            'transition-all duration-300',
                            showLogo ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                        )}
                    >
                        <Link
                            href="/"
                            className="font-serif text-xl tracking-[0.25em] uppercase z-50 text-foreground hover:opacity-70 transition-opacity whitespace-nowrap"
                        >
                            Kevin Long
                        </Link>
                    </div>
                </div>

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
                                <span
                                    className={cn(
                                        'absolute -bottom-1 left-0 right-0 h-[1.5px] bg-foreground transition-transform duration-300 origin-left',
                                        isActive ? 'scale-x-100' : 'scale-x-0'
                                    )}
                                />
                            </Link>
                        );
                    })}
                </nav>

                <div className="md:hidden">
                    <button className="text-foreground p-2" aria-label="Open navigation menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
