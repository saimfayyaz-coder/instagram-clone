import { MediaAlbum } from '@/shared/types/media.types';
import { cameraRollGallery, GalleryPage } from './cameraRollGallery';

export type { GalleryPage };

export const getAlbums = (): Promise<MediaAlbum[]> => cameraRollGallery.getAlbums();

// No album means all photos (Recents)
export const getPhotos = (params: {
  album?: string;
  after?: string;
  first: number;
}): Promise<GalleryPage> => cameraRollGallery.getPhotos(params);
