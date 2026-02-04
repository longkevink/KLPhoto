import { CSSProperties, memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import CldImage from '@/components/ui/CldImage';
import { LayoutTemplate, PhotoCard } from '@/content/types';
import { cloudinaryCloudName } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';
import { GridConfig } from './wall.styles';

export interface WallSlotProps {
    index: number;
    photo: PhotoCard | null;
    activeSlotIndex: number;
    onSlotClick: (index: number) => void;
    onClearSlot: (index: number) => void;
    gridConfig: GridConfig;
    layout: LayoutTemplate;
    frameStyles: CSSProperties;
    matClasses: string;
    colSpan: string;
    performanceMode: boolean;
}

export const WallSlot = memo(function WallSlot({
    index,
    photo,
    activeSlotIndex,
    onSlotClick,
    onClearSlot,
    gridConfig,
    layout,
    frameStyles,
    matClasses,
    colSpan,
    performanceMode,
}: WallSlotProps) {
    const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}` });

    const isSingle = layout === 'single';
    const isGridFit = layout === 'gallery-6' || layout.startsWith('collage');

    const gridCellStyle: CSSProperties = isSingle || isGridFit
        ? {
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
          }
        : {
              width: '100%',
              height: '100%',
          };

    return (
        <motion.div
            ref={setNodeRef}
            onClick={() => onSlotClick(index)}
            className={cn(
                'relative group cursor-pointer flex items-center justify-center',
                !performanceMode && 'transition-all duration-300',
                gridConfig.item,
                colSpan,
                isOver && !photo && 'ring-2 ring-white scale-105 z-20'
            )}
            style={gridCellStyle}
        >
            <div
                className={cn(
                    'relative',
                    !performanceMode && 'transition-all duration-500',
                    activeSlotIndex === index && !photo ? 'ring-2 ring-white/50 ring-offset-4 ring-offset-transparent' : '',
                    activeSlotIndex === index && photo ? 'scale-[1.02] z-20' : !performanceMode && 'hover:scale-[1.02] hover:z-10',
                    !photo && 'bg-white/5 border border-white/10 rounded-sm w-full aspect-square',
                    !photo && !performanceMode && 'backdrop-blur-[2px] hover:bg-white/10 transition-all duration-500'
                )}
                style={
                    photo && (isSingle || isGridFit)
                        ? {
                              maxWidth: '100%',
                              maxHeight: '100%',
                              width: 'auto',
                              height: 'auto',
                          }
                        : {
                              width: '100%',
                              height: '100%',
                          }
                }
            >
                {photo ? (
                    <div className="w-full h-full relative" style={frameStyles}>
                        <div className={cn('w-full h-full relative overflow-hidden bg-neutral-50', matClasses)}>
                            <div className="relative w-full h-full shadow-[inset_1px_1px_15px_rgba(0,0,0,0.15)]">
                                {photo.cloudinaryId && cloudinaryCloudName ? (
                                    <CldImage
                                        src={photo.cloudinaryId}
                                        alt={photo.alt}
                                        fill={!(isSingle || isGridFit)}
                                        width={isSingle || isGridFit ? photo.width : undefined}
                                        height={isSingle || isGridFit ? photo.height : undefined}
                                        className={cn(
                                            'object-cover',
                                            (isSingle || isGridFit) && 'max-w-full max-h-full w-auto h-auto'
                                        )}
                                        sizes={
                                            isSingle || isGridFit
                                                ? '(max-width: 1024px) 70vw, 1200px'
                                                : '(max-width: 768px) 100vw, 33vw'
                                        }
                                        loading="lazy"
                                    />
                                ) : (
                                    <Image
                                        src={photo.src}
                                        alt={photo.alt}
                                        fill={!(isSingle || isGridFit)}
                                        width={isSingle || isGridFit ? photo.width : undefined}
                                        height={isSingle || isGridFit ? photo.height : undefined}
                                        className={cn(
                                            'object-cover',
                                            (isSingle || isGridFit) && 'max-w-full max-h-full w-auto h-auto'
                                        )}
                                        sizes={
                                            isSingle || isGridFit
                                                ? '(max-width: 1024px) 70vw, 1200px'
                                                : '(max-width: 768px) 100vw, 33vw'
                                        }
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>
                        {!performanceMode && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none mix-blend-soft-light opacity-60" />
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onClearSlot(index);
                                    }}
                                    className="absolute -top-3 -right-3 bg-neutral-900/80 backdrop-blur-md text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-50 hover:bg-red-500"
                                >
                                    <X size={14} />
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-3">
                        <Plus size={isSingle ? 32 : 18} />
                    </div>
                )}
            </div>
        </motion.div>
    );
});
