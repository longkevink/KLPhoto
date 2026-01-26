'use client';

import { motion } from 'framer-motion';
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
            url: 'https://instagram.com/kevinlong', // Dummy link
            icon: Instagram,
            color: 'bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white hover:opacity-90',
        },
    ];

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-2xl mx-auto flex flex-col justify-center">
            <div className="text-center mb-16">
                <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Connect</h1>
                <p className="text-gray-500 font-light text-lg">
                    Follow the journey or collect a piece of it.
                </p>
            </div>

            <div className="space-y-6">
                {links.map((link, index) => (
                    <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn("p-4 rounded-full shadow-inner", link.color)}>
                                <link.icon size={24} />
                            </div>
                            <div>
                                <h2 className="font-serif text-xl group-hover:underline decoration-1 underline-offset-4">{link.title}</h2>
                                <p className="text-gray-400 text-sm mt-1">{link.description}</p>
                            </div>
                        </div>

                        <div className="text-gray-300 group-hover:text-black transition-colors">
                            <ArrowRight size={24} />
                        </div>
                    </motion.a>
                ))}
            </div>
        </main>
    );
}
