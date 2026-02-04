import { memo } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GalleryEnvironment, LayoutTemplate } from '@/content/types';
import { cn } from '@/lib/utils';
import { ENVIRONMENTS, LAYOUTS } from './gallery.constants';

export interface GalleryTopToolbarProps {
    environment: GalleryEnvironment;
    layout: LayoutTemplate;
    onEnvironmentChange: (environment: GalleryEnvironment) => void;
    onLayoutChange: (layout: LayoutTemplate) => void;
    onClearLayout: () => void;
    disableMotion: boolean;
    compact?: boolean;
}

export const GalleryTopToolbar = memo(function GalleryTopToolbar({
    environment,
    layout,
    onEnvironmentChange,
    onLayoutChange,
    onClearLayout,
    disableMotion,
    compact = false,
}: GalleryTopToolbarProps) {
    return (
        <div
            className={cn(
                compact
                    ? 'relative z-30 flex items-center gap-2 bg-white/85 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-xl w-full overflow-x-auto'
                    : 'absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-white/20 p-2 rounded-full shadow-2xl',
                !disableMotion && 'transition-all duration-300 hover:bg-white/90'
            )}
        >
            <div className="flex bg-neutral-100/50 rounded-full p-1">
                {ENVIRONMENTS.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => onEnvironmentChange(id)}
                        aria-label={`Set environment to ${label}`}
                        className={cn(
                            'flex items-center gap-2 px-3 md:px-4 py-2 text-xs font-medium rounded-full tap-target',
                            !disableMotion && 'transition-all duration-300',
                            environment === id
                                ? 'bg-white text-black shadow-sm scale-105'
                                : 'text-neutral-500 hover:text-black hover:bg-white/50'
                        )}
                        title={label}
                    >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
            </div>

            <div className="w-px h-6 bg-neutral-200" />

            <div className="flex bg-neutral-100/50 rounded-full p-1">
                {LAYOUTS.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => onLayoutChange(id)}
                        aria-label={`Set layout to ${label}`}
                        className={cn(
                            'flex items-center gap-2 px-3 md:px-4 py-2 text-xs font-medium rounded-full tap-target',
                            !disableMotion && 'transition-all duration-300',
                            layout === id
                                ? 'bg-white text-black shadow-sm scale-105'
                                : 'text-neutral-500 hover:text-black hover:bg-white/50'
                        )}
                        title={label}
                    >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
            </div>

            <div className="w-px h-6 bg-neutral-200" />

            <Button
                variant="ghost"
                size="icon"
                onClick={onClearLayout}
                className="rounded-full w-8 h-8 hover:bg-red-50 hover:text-red-500 text-neutral-400 tap-target"
                title="Clear All"
                aria-label="Clear all slots"
            >
                <RotateCcw size={14} />
            </Button>
        </div>
    );
});
