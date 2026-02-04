import { Photo } from './types';
import { momentsPhotos } from './photo-data/moments';
import { streetPhotos } from './photo-data/street';
import { travelPhotos } from './photo-data/travel';

export const photos: Photo[] = [...streetPhotos, ...travelPhotos, ...momentsPhotos];
