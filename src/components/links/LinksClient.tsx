'use client';

import { ArrowRight, ShoppingBag, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LinksPage() {
    const links = [
        {
            id: 'etsy',
            title: 'Etsy Shop',
            description: 'Purchase archival prints',
            url: 'https://www.etsy.com/shop/KevinLongPhotography', // Dummy link
            icon: ShoppingBag,
            color: 'bg-[#F1641E] text-white hover:bg-[#D45719]',
        },
        {
            id: 'instagram',
            title: 'Instagram',
            description: 'Follow me for daily updates',
            url: 'https://instagram.com/ke_long',
            icon: Instagram,
            color: 'bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white hover:opacity-90',
        },
    ];

    return (
        <main className="min-h-screen-safe pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 max-w-2xl mx-auto flex flex-col justify-center">
            <div className="text-center mb-10 md:mb-16">
                <h1 className="font-serif text-[clamp(2rem,10vw,3rem)] tracking-tight mb-3 md:mb-4">Connect</h1>
                <p className="text-gray-500 font-light text-fluid-md">
                    Follow the journey or collect a piece of it.
                </p>
            </div>

            <div className="space-y-4 md:space-y-6">
                {links.map((link, index) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 md:p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 md:hover:-translate-y-1 animate-fade-up tap-target"
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        <div className="flex items-center gap-3 md:gap-6 min-w-0">
                            <div className={cn("p-3 md:p-4 rounded-full shadow-inner shrink-0", link.color)}>
                                <link.icon size={22} />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-serif text-lg md:text-xl group-hover:underline decoration-1 underline-offset-4 truncate">{link.title}</h2>
                                <p className="text-gray-400 text-xs md:text-sm mt-1">{link.description}</p>
                            </div>
                        </div>

                        <div className="text-gray-300 group-hover:text-black transition-colors shrink-0 pl-2">
                            <ArrowRight size={20} />
                        </div>
                    </a>
                ))}
            </div>
        </main>
    );
}
