import { Photo } from '@/content/types';
import { allPhotos } from './all';

export const momentsPhotos: Photo[] = allPhotos.filter((photo) => photo.category === 'moments');
