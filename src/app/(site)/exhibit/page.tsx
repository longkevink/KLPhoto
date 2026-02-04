import { getExhibitPhotoCardsByCategory, getPhotoDetailById } from '@/lib/photos';
import { Metadata } from 'next';
import ExhibitClient from '@/components/exhibit/ExhibitClient';

export const metadata: Metadata = {
    title: 'Exhibit | Kevin Long Photography',
    description:
        'Browse photography collections in an immersive film-strip experience. Travel, moments, and street.',
    openGraph: {
        title: 'Exhibit | Kevin Long Photography',
        description: 'Browse photography collections in an immersive film-strip experience.',
        type: 'website',
        // url: '/exhibit', // relative URLs might not work well without base, leaving generic or relying on metadataBase in layout
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Exhibit | Kevin Long Photography',
        description: 'Browse photography collections in an immersive film-strip experience.',
    },
};

interface ExhibitPageProps {
    searchParams: Promise<{ photo?: string }>;
}

export default async function ExhibitPage({ searchParams }: ExhibitPageProps) {
    const params = await searchParams;
    const spotlightPhotoId = params.photo;
    const spotlightPhoto = spotlightPhotoId ? getPhotoDetailById(spotlightPhotoId) : null;

    const photosByCategory = getExhibitPhotoCardsByCategory();

    return (
        <ExhibitClient
            photosByCategory={photosByCategory}
            initialSpotlightPhoto={spotlightPhoto}
        />
    );
}
