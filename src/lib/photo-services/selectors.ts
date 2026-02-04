import { photos } from '@/content/photos';
import { Photo, PhotoCard, PhotoCategory, PhotoDetail } from '@/content/types';
import { toPhotoCard, toPhotoDetail } from './mappers';

export function getAllPhotos(): Photo[] {
    return photos;
}

export function getPhotoById(id: string): Photo | null {
    return photos.find((photo) => photo.id === id) ?? null;
}

export function getPhotoDetailById(id: string): PhotoDetail | null {
    const photo = getPhotoById(id);
    return photo ? toPhotoDetail(photo) : null;
}

export function getPhotosByCategory(category: PhotoCategory): Photo[] {
    return photos.filter((photo) => photo.category === category);
}

export function getPhotoCardsByCategory(category: PhotoCategory): PhotoCard[] {
    return getPhotosByCategory(category).map(toPhotoCard);
}

export function getFeaturedPhotos(): Photo[] {
    return photos.filter((photo) => photo.featured);
}

export function getPhotosGroupedByCategory(): Record<PhotoCategory, Photo[]> {
    return {
        street: getPhotosByCategory('street'),
        travel: getPhotosByCategory('travel'),
        moments: getPhotosByCategory('moments'),
    };
}

export function getGalleryPhotoCardsByCategory(): Record<PhotoCategory, PhotoCard[]> {
    return {
        street: getPhotoCardsByCategory('street'),
        travel: getPhotoCardsByCategory('travel'),
        moments: getPhotoCardsByCategory('moments'),
    };
}

export function getExhibitPhotoCardsByCategory(): Record<PhotoCategory, PhotoCard[]> {
    return {
        travel: getPhotoCardsByCategory('travel'),
        moments: getPhotoCardsByCategory('moments'),
        street: getPhotoCardsByCategory('street'),
    };
}

export function getAllSeries(): string[] {
    const seriesSet = new Set<string>();
    photos.forEach((photo) => {
        if (photo.series) {
            seriesSet.add(photo.series);
        }
    });
    return Array.from(seriesSet);
}

export function getPhotosBySeries(series: string): Photo[] {
    return photos.filter((photo) => photo.series === series);
}
