import { photos } from '@/content/photos';
import { Photo, PhotoCard } from '@/content/types';
import { toPhotoCard } from './mappers';

export function getHeroPhoto(): Photo | null {
    const specificId = '-a733931-vjjbiz';
    const specific = photos.find((photo) => photo.id === specificId && photo.cloudinaryId);
    if (specific) return specific;

    return photos.find((photo) => photo.featured && photo.orientation === 'landscape' && photo.cloudinaryId) || null;
}

export function getHomeGalleryPhotos(limit = 18): Photo[] {
    const travelFeatured = photos.filter(
        (photo) => photo.category === 'travel' && photo.featured && photo.cloudinaryId
    );
    const travelNonFeatured = photos.filter(
        (photo) => photo.category === 'travel' && !photo.featured && photo.cloudinaryId
    );
    const nonStreetFeatured = photos.filter(
        (photo) =>
            photo.category !== 'street' &&
            photo.category !== 'travel' &&
            photo.featured &&
            photo.cloudinaryId
    );
    const nonStreetSeries = photos.filter(
        (photo) =>
            photo.category !== 'street' &&
            photo.category !== 'travel' &&
            !photo.featured &&
            photo.series &&
            photo.cloudinaryId
    );
    const nonStreetPortraits = photos.filter(
        (photo) =>
            photo.category !== 'street' &&
            photo.category !== 'travel' &&
            !photo.featured &&
            photo.orientation === 'portrait' &&
            photo.cloudinaryId
    );
    const nonStreetRemaining = photos.filter(
        (photo) =>
            photo.category !== 'street' &&
            photo.category !== 'travel' &&
            !photo.featured &&
            !photo.series &&
            photo.orientation !== 'portrait' &&
            photo.cloudinaryId
    );

    const pools: Photo[][] = [
        travelFeatured,
        nonStreetFeatured,
        travelNonFeatured,
        nonStreetSeries,
        travelNonFeatured,
        nonStreetPortraits,
        nonStreetRemaining,
    ];
    const picked: Photo[] = [];
    const usedIds = new Set<string>();

    while (picked.length < limit && pools.some((pool) => pool.length > 0)) {
        for (const pool of pools) {
            const next = pool.shift();
            if (!next || usedIds.has(next.id)) continue;
            usedIds.add(next.id);
            picked.push(next);
            if (picked.length === limit) break;
        }
    }

    return picked;
}

export function getHomeGalleryPhotoCards(limit = 18): PhotoCard[] {
    return getHomeGalleryPhotos(limit).map(toPhotoCard);
}
