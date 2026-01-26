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
