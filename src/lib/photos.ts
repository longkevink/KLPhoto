import { photos } from '@/content/photos';
import { Photo, PhotoCategory } from '@/content/types';

/**
 * Get all photos from the collection
 */
export function getAllPhotos(): Photo[] {
    return photos;
}

/**
 * Get a single photo by its ID
 * @param id - The unique photo identifier
 * @returns The photo or null if not found
 */
export function getPhotoById(id: string): Photo | null {
    return photos.find((photo) => photo.id === id) ?? null;
}

/**
 * Get all photos in a specific category
 * @param category - The category to filter by
 */
export function getPhotosByCategory(category: PhotoCategory): Photo[] {
    return photos.filter((photo) => photo.category === category);
}

/**
 * Get all featured photos (for Home and Selected Works)
 */
export function getFeaturedPhotos(): Photo[] {
    return photos.filter((photo) => photo.featured);
}

/**
 * Curated homepage selection with heavier weighting for Cloudinary images.
 * Prioritizes featured work, then adds variety from series and portraits.
 */
export function getHomeGalleryPhotos(limit = 18): Photo[] {
    const featured = photos.filter((photo) => photo.featured && photo.cloudinaryId);
    const series = photos.filter((photo) => !photo.featured && photo.series && photo.cloudinaryId);
    const portraits = photos.filter(
        (photo) =>
            !photo.featured &&
            photo.orientation === 'portrait' &&
            photo.cloudinaryId
    );
    const remaining = photos.filter(
        (photo) =>
            !photo.featured &&
            !photo.series &&
            photo.orientation !== 'portrait' &&
            photo.cloudinaryId
    );

    const pools: Photo[][] = [featured, series, portraits, remaining];
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

/**
 * Get photos grouped by category
 * Returns an object with category keys and photo arrays
 */
export function getPhotosGroupedByCategory(): Record<PhotoCategory, Photo[]> {
    return {
        street: getPhotosByCategory('street'),
        travel: getPhotosByCategory('travel'),
        moments: getPhotosByCategory('moments'), // Empty array - no photos in this category
    };
}

/**
 * Get unique series names from the collection
 */
export function getAllSeries(): string[] {
    const seriesSet = new Set<string>();
    photos.forEach((photo) => {
        if (photo.series) {
            seriesSet.add(photo.series);
        }
    });
    return Array.from(seriesSet);
}

/**
 * Get photos by series name
 * @param series - The series name to filter by
 */
export function getPhotosBySeries(series: string): Photo[] {
    return photos.filter((photo) => photo.series === series);
}
