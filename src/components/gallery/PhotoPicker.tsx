'use client';

import Image from 'next/image';
import CldImage from '@/components/ui/CldImage';
import { Photo, PhotoCategory } from '@/content/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cloudinaryCloudName } from '@/lib/cloudinary';

interface PhotoPickerProps {
    photosGrouped: Record<PhotoCategory, Photo[]>;
    onPhotoSelect: (photo: Photo) => void;
}

export default function PhotoPicker({ photosGrouped, onPhotoSelect }: PhotoPickerProps) {
    const categories: PhotoCategory[] = ['travel', 'street'];

    return (
        <aside className="w-80 h-full bg-white border-r border-neutral-100 overflow-y-auto flex flex-col z-10 scrollbar-thin scrollbar-thumb-neutral-200">
            <div className="p-6 sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-neutral-50">
                <h2 className="font-serif text-2xl tracking-tight text-neutral-900">Collections</h2>
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                    Drag or click photos to add to wall.
                </p>
            </div>

            <div className="p-6 space-y-10 pb-20">
                {categories.map((category) => (
                    <div key={category}>
                        <div className="flex items-center justify-between mb-4 sticky top-[88px] bg-white/95 py-2 z-10 backdrop-blur-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                                {category}
                            </h3>
                            <span className="text-[10px] text-neutral-300 font-medium px-2 py-0.5 bg-neutral-50 rounded-full">
                                {photosGrouped[category]?.length || 0}
                            </span>
                        </div>
                        
                        <div className="columns-2 gap-3 space-y-3">
                            {photosGrouped[category]?.map((photo) => (
                                <motion.button
                                    key={photo.id}
                                    onClick={() => onPhotoSelect(photo)}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "break-inside-avoid mb-3 group relative w-full bg-neutral-100 rounded-lg overflow-hidden focus-visible:ring-2 focus-visible:ring-black outline-none shadow-sm hover:shadow-md transition-all flex items-center justify-center",
                                        photo.orientation === 'landscape' ? "aspect-[3/2]" : "aspect-[2/3]"
                                    )}
                                >
                                    {photo.cloudinaryId && cloudinaryCloudName ? (
                                        <CldImage
                                            src={photo.cloudinaryId}
                                            alt={photo.alt}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="150px"
                                        />
                                    ) : (
                                        <Image
                                            src={photo.src}
                                            alt={photo.alt}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="150px"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    
                                    {/* Plus Icon Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="bg-white/90 p-1.5 rounded-full shadow-sm text-black">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
