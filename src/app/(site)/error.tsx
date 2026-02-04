'use client';

import { useEffect } from 'react';

interface SiteErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function SiteError({ error, reset }: SiteErrorProps) {
    useEffect(() => {
        console.error('Route error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md text-center space-y-4">
                <h2 className="font-serif text-3xl">Something went wrong.</h2>
                <p className="text-sm text-muted">
                    The page hit an unexpected error. Try reloading this route.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center justify-center px-5 h-10 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
