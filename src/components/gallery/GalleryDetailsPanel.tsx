import { memo } from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';
import CldImage from '@/components/ui/CldImage';
import { Button } from '@/components/ui/Button';
import { PhotoCard } from '@/content/types';
import { DEFAULT_ETSY_URL } from '@/config/purchase';
import { cn } from '@/lib/utils';

export interface GalleryDetailsPanelProps {
    selectedPhoto: PhotoCard | null;
    rightSidebarOpen: boolean;
    onCloseSidebar: () => void;
    mobile?: boolean;
}

export const GalleryDetailsPanel = memo(function GalleryDetailsPanel({
    selectedPhoto,
    rightSidebarOpen,
    onCloseSidebar,
    mobile = false,
}: GalleryDetailsPanelProps) {
    return (
        <aside
            className={cn(
                mobile
                    ? 'fixed inset-x-0 bottom-0 z-40 bg-white border-t border-neutral-100 p-0 flex flex-col shadow-[0_-20px_35px_-18px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-in-out rounded-t-2xl max-h-[70svh]'
                    : 'fixed inset-y-0 right-0 pt-[64px] z-40 w-80 bg-white border-l border-neutral-100 p-0 flex flex-col shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-in-out lg:relative lg:pt-0 lg:translate-x-0',
                rightSidebarOpen ? 'translate-x-0 translate-y-0' : mobile ? 'translate-y-full' : 'translate-x-full'
            )}
        >
            <button
                onClick={onCloseSidebar}
                className={cn(
                    'absolute p-2 bg-neutral-900 text-white rounded-full z-50 tap-target',
                    mobile ? 'top-3 right-3 left-auto' : 'top-4 left-4 lg:hidden'
                )}
                aria-label="Close details"
            >
                <X size={16} />
            </button>
            {selectedPhoto ? (
                <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-500">
                    <div
                        className={cn(
                            'relative w-full bg-neutral-100 overflow-hidden',
                            selectedPhoto.orientation === 'landscape' ? 'aspect-[3/2]' : 'aspect-[2/3]'
                        )}
                    >
                        {selectedPhoto.cloudinaryId ? (
                            <CldImage
                                src={selectedPhoto.cloudinaryId}
                                alt={selectedPhoto.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 320px"
                                loading="lazy"
                            />
                        ) : (
                            <Image
                                src={selectedPhoto.src}
                                alt={selectedPhoto.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 320px"
                                loading="lazy"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-white text-xs font-medium tracking-wide">Preview</span>
                        </div>
                    </div>

                    <div className={cn('flex-1 flex flex-col', mobile ? 'p-5' : 'p-8')}>
                        <div className={cn(mobile ? 'mb-4' : 'mb-6')}>
                            <h3 className={cn('font-serif text-neutral-900 leading-tight', mobile ? 'text-xl' : 'text-2xl')}>{selectedPhoto.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                    {selectedPhoto.category}
                                </span>
                                {selectedPhoto.series && <span className="text-neutral-400 text-xs">— {selectedPhoto.series}</span>}
                            </div>
                        </div>

                        <p className={cn('text-sm text-neutral-500 leading-relaxed flex-1', mobile ? 'mb-5' : 'mb-8')}>
                            High-resolution archival pigment print on Hahnemühle Photo Rag 308gsm. Museum quality,
                            designed to last a lifetime without fading.
                        </p>

                        <div className="space-y-3">
                            <Button
                                className="w-full bg-[#F1641E] hover:bg-[#d95616] text-white rounded-full h-12 text-sm font-bold tracking-wide shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5"
                                onClick={() => window.open(DEFAULT_ETSY_URL, '_blank')}
                            >
                                Purchase Print
                            </Button>
                            <p className="text-center text-[10px] text-neutral-400 uppercase tracking-widest">
                                Secure checkout via Etsy
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                        <Maximize2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">No Selection</h3>
                        <p className="text-sm text-neutral-500 mt-2 max-w-[200px] mx-auto">
                            Select a photo from the wall to view details and purchasing options.
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
});
