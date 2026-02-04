import { DEFAULT_ETSY_URL } from '@/config/purchase';
import { Photo, PhotoCard, PhotoDetail } from '@/content/types';

export function toPhotoCard(photo: Photo): PhotoCard {
    return {
        id: photo.id,
        src: photo.src,
        alt: photo.alt,
        title: photo.title,
        category: photo.category,
        series: photo.series,
        orientation: photo.orientation,
        width: photo.width,
        height: photo.height,
        cloudinaryId: photo.cloudinaryId,
    };
}

export function toPhotoDetail(photo: Photo): PhotoDetail {
    return {
        ...toPhotoCard(photo),
        etsyUrl: photo.etsyUrl ?? DEFAULT_ETSY_URL,
    };
}
