import { getPhotosByCategory, getPhotoById } from '@/lib/photos';
import { PhotoCategory } from '@/content/types';
import { Metadata } from 'next';
import ExhibitClient from '@/components/exhibit/ExhibitClient';

export const metadata: Metadata = {
    title: 'Exhibit',
    description:
        'Browse photography collections in an immersive film-strip experience. Street, travel, and moments.',
};

interface ExhibitPageProps {
    searchParams: Promise<{ photo?: string }>;
}

export default async function ExhibitPage({ searchParams }: ExhibitPageProps) {
    const params = await searchParams;
    const spotlightPhotoId = params.photo;
    const spotlightPhoto = spotlightPhotoId ? getPhotoById(spotlightPhotoId) : null;

    // Get data server-side
    const categories: PhotoCategory[] = ['street', 'travel', 'moments'];
    const photosByCategory = Object.fromEntries(
        categories.map((cat) => [cat, getPhotosByCategory(cat)])
    ) as Record<PhotoCategory, ReturnType<typeof getPhotosByCategory>>;

    return (
        <ExhibitClient
            photosByCategory={photosByCategory}
            initialSpotlightPhoto={spotlightPhoto}
        />
    );
}
