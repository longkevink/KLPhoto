import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-20 bg-background border-t border-border mt-auto">
            <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-10">

                {/* Navigation Links (Simple Text) */}
                <div className="flex gap-10 text-[13px] font-medium text-muted uppercase tracking-ultra-wide">
                    <Link href="/exhibit" className="hover:text-foreground transition-colors">Exhibit</Link>
                    <Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
                    <Link href="/links" className="hover:text-foreground transition-colors">Links</Link>
                </div>

                {/* Brand & Copyright */}
                <div className="text-center">
                    <p className="font-serif text-xl tracking-[0.2em] uppercase mb-4 text-foreground">Kevin Long Photography</p>
                    <p className="text-[11px] text-muted tracking-ultra-wide uppercase">
                        &copy; {currentYear} &mdash; All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
