import { cn } from '@/lib/utils';

export default function SkipLink() {
    return (
        <a
            href="#main-content"
            className={cn(
                "absolute top-4 left-4 z-[100] px-6 py-3 bg-black text-white font-medium text-sm rounded-sm transform -translate-y-[150%] transition-transform duration-300 focus:translate-y-0 opacity-0 focus:opacity-100",
            )}
        >
            Skip to main content
        </a>
    );
}
