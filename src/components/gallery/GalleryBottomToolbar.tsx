import { memo } from 'react';
import { FrameStyle, MatOption } from '@/content/types';
import { cn } from '@/lib/utils';

export interface GalleryBottomToolbarProps {
    frameStyle: FrameStyle;
    matOption: MatOption;
    onFrameStyleChange: (frameStyle: FrameStyle) => void;
    onMatOptionChange: (matOption: MatOption) => void;
    disableMotion: boolean;
    compact?: boolean;
}

export const GalleryBottomToolbar = memo(function GalleryBottomToolbar({
    frameStyle,
    matOption,
    onFrameStyleChange,
    onMatOptionChange,
    disableMotion,
    compact = false,
}: GalleryBottomToolbarProps) {
    return (
        <div
            className={cn(
                compact
                    ? 'relative z-30 flex items-center gap-4 bg-white/85 backdrop-blur-xl border border-white/20 px-3 py-3 rounded-2xl shadow-xl w-full overflow-x-auto no-scrollbar'
                    : 'absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 md:gap-8 bg-white/80 backdrop-blur-xl border border-white/20 px-4 md:px-8 py-3 rounded-full shadow-2xl max-w-[90vw] overflow-x-auto no-scrollbar',
                !disableMotion && 'transition-all duration-300 hover:bg-white/90'
            )}
        >
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline">
                    Frame
                </span>
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => onFrameStyleChange('thin-black')}
                        aria-label="Select black frame"
                        className={cn(
                            'w-5 h-5 md:w-6 md:h-6 rounded-full bg-black border border-neutral-200 ring-offset-2',
                            !disableMotion && 'transition-all',
                            frameStyle === 'thin-black' && 'ring-2 ring-black scale-110'
                        )}
                        title="Black"
                    />
                    <button
                        onClick={() => onFrameStyleChange('thin-white')}
                        aria-label="Select white frame"
                        className={cn(
                            'w-5 h-5 md:w-6 md:h-6 rounded-full bg-white border border-neutral-200 ring-offset-2',
                            !disableMotion && 'transition-all',
                            frameStyle === 'thin-white' && 'ring-2 ring-neutral-300 scale-110'
                        )}
                        title="White"
                    />
                    <button
                        onClick={() => onFrameStyleChange('natural-wood')}
                        aria-label="Select wood frame"
                        className={cn(
                            'w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#8B5E3C] border border-neutral-200 ring-offset-2',
                            !disableMotion && 'transition-all',
                            frameStyle === 'natural-wood' && 'ring-2 ring-[#8B5E3C] scale-110'
                        )}
                        title="Wood"
                    />
                </div>
            </div>

            <div className="w-px h-6 bg-neutral-200 shrink-0" />

            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline">
                    Mat
                </span>
                <div className="flex bg-neutral-100/50 rounded-full p-0.5">
                    <button
                        onClick={() => onMatOptionChange('none')}
                        aria-label="Set mat to none"
                        className={cn(
                            'px-2 md:px-3 py-1 text-[10px] uppercase font-bold rounded-full',
                            !disableMotion && 'transition-all',
                            matOption === 'none' ? 'bg-white shadow-sm text-black' : 'text-neutral-400 hover:text-black'
                        )}
                    >
                        None
                    </button>
                    <button
                        onClick={() => onMatOptionChange('white')}
                        aria-label="Set mat to white"
                        className={cn(
                            'px-2 md:px-3 py-1 text-[10px] uppercase font-bold rounded-full',
                            !disableMotion && 'transition-all',
                            matOption === 'white' ? 'bg-white shadow-sm text-black' : 'text-neutral-400 hover:text-black'
                        )}
                    >
                        White
                    </button>
                </div>
            </div>
        </div>
    );
});
