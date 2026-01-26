'use client';

import { useDraggable } from '@dnd-kit/core'; // Could use dnd-kit or just native/simple logic
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { Photo, PhotoCategory } from '@/content/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cloudinaryCloudName } from '@/lib/cloudinary';

interface PhotoPickerProps {
    photosGrouped: Record<PhotoCategory, Photo[]>;
    onPhotoSelect: (photo: Photo) => void;
}

export default function PhotoPicker({ photosGrouped, onPhotoSelect }: PhotoPickerProps) {
    const categories: PhotoCategory[] = ['street', 'travel'];

    return (
        <aside className="w-80 h-full border-r border-gray-200 overflow-y-auto bg-white flex flex-col shadow-sm z-10">
            <div className="p-6 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
                <h2 className="font-serif text-xl tracking-tight">Gallery Selection</h2>
                <p className="text-xs text-gray-500 mt-2">
                    Click photos to add them to the active frame layout slot.
                </p>
            </div>

            <div className="p-6 space-y-8">
                {categories.map((category) => (
                    <div key={category}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 sticky top-16 bg-white py-1">
                            {category}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {photosGrouped[category].map((photo) => (
                                <motion.button
                                    key={photo.id}
                                    onClick={() => onPhotoSelect(photo)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative aspect-square bg-gray-100 rounded-sm overflow-hidden focus-visible:ring-2 focus-visible:ring-black outline-none"
                                >
                                    {photo.cloudinaryId && cloudinaryCloudName ? (
                                        <CldImage
                                            src={photo.cloudinaryId}
                                            alt={photo.alt}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                                            sizes="150px"
                                        />
                                    ) : (
                                        <Image
                                            src={photo.src}
                                            alt={photo.alt}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                                            sizes="150px"
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                                        <span className="sr-only">Add {photo.title}</span>
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
