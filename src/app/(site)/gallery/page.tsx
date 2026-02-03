import { getPhotosGroupedByCategory } from '@/lib/photos';
import { Metadata } from 'next';
import GalleryClient from '@/components/gallery/GalleryClient';

export const metadata: Metadata = {
    title: 'Gallery Wall | Kevin Long Photography',
    description:
        'Visualize premium prints in varied environments and layouts. Create your perfect wall.',
    openGraph: {
        title: 'Gallery Wall | Kevin Long Photography',
        description: 'Visualize premium prints in varied environments and layouts.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gallery Wall | Kevin Long Photography',
        description: 'Visualize premium prints in varied environments and layouts.',
    },
};

export default function GalleryPage() {
    const photosGrouped = getPhotosGroupedByCategory();

    return <GalleryClient photosGrouped={photosGrouped} />;
}
