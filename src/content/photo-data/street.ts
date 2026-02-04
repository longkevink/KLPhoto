import { Photo } from '@/content/types';
import { allPhotos } from './all';

export const streetPhotos: Photo[] = allPhotos.filter((photo) => photo.category === 'street');
