import { getPhotosGroupedByCategory } from '@/lib/photos';
import { Metadata } from 'next';
import GalleryClient from '@/components/gallery/GalleryClient';

export const metadata: Metadata = {
    title: 'Gallery Wall',
    description:
        'Visualize premium prints in varied environments and layouts. Create your perfect wall.',
};

export default function GalleryPage() {
    const photosGrouped = getPhotosGroupedByCategory();

    return <GalleryClient photosGrouped={photosGrouped} />;
}
