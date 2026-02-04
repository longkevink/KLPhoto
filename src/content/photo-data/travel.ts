import { Photo } from '@/content/types';
import { allPhotos } from './all';

export const travelPhotos: Photo[] = allPhotos.filter((photo) => photo.category === 'travel');
