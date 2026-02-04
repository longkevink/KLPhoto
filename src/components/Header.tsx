'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const HEADER_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/exhibit', label: 'Exhibit' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/links', label: 'Links' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const mobilePanelRef = useRef<HTMLDivElement>(null);
    const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

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

    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const panel = mobilePanelRef.current;
        const focusable = panel?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        focusable?.[0]?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
                return;
            }

            if (event.key !== 'Tab' || !focusable || focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) return;
        mobileMenuButtonRef.current?.focus();
    }, [isMobileMenuOpen]);

    const isScrolledOrGallery = isScrolled || isGalleryPage;
    const showLogo = isScrolledOrGallery || !isHomePage;

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
                isScrolledOrGallery
                    ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-sm'
                    : 'bg-transparent py-4 md:py-6'
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <div className="w-40 md:w-48 h-8 flex items-center">
                    <div
                        className={cn(
                            'transition-all duration-300',
                            showLogo ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                        )}
                    >
                        <Link
                            href="/"
                            className="font-serif text-lg md:text-xl tracking-[0.2em] md:tracking-[0.25em] uppercase z-50 text-foreground hover:opacity-70 transition-opacity whitespace-nowrap"
                        >
                            Kevin Long
                        </Link>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-10" aria-label="Primary navigation">
                    {HEADER_LINKS.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-[13px] font-medium tracking-ultra-wide uppercase transition-colors relative',
                                    isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
                                )}
                                aria-current={isActive ? 'page' : undefined}
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
                    <button
                        ref={mobileMenuButtonRef}
                        className="text-foreground p-2 tap-target"
                        aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-controls="mobile-nav-panel"
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d={isMobileMenuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 8h16M4 16h16'} />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={cn('md:hidden fixed inset-0 z-40', isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
                <button
                    type="button"
                    aria-label="Close menu overlay"
                    className={cn(
                        'absolute inset-0 bg-black/35 transition-opacity',
                        isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div
                    id="mobile-nav-panel"
                    ref={mobilePanelRef}
                    className={cn(
                        'absolute right-0 top-0 h-full w-[85vw] max-w-[340px] bg-background border-l border-border shadow-2xl p-6 pt-24 transition-transform duration-300 ease-out',
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    )}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                >
                    <nav className="flex flex-col gap-1" aria-label="Mobile primary navigation">
                        {HEADER_LINKS.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        'tap-target px-4 py-3 rounded-md text-sm tracking-premium-wide uppercase transition-colors',
                                        isActive ? 'bg-foreground text-background' : 'text-foreground hover:bg-black/5'
                                    )}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
}
