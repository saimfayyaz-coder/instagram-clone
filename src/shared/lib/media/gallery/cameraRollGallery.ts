import { CameraRoll, PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { GALLERY_CONFIG } from '@/shared/constants';
import { MediaAlbum, MediaAsset } from '@/shared/types/media.types';

const ASSET_TYPE_PHOTOS = 'Photos';
const ALBUM_TYPE_ALBUM = 'Album';
// Only the size is needed; filename and fileSize cost an extra lookup per photo on iOS
const INCLUDE_FIELDS: ['imageSize'] = ['imageSize'];

export interface GalleryPage {
  assets: MediaAsset[];
  endCursor?: string;
  hasNextPage: boolean;
}

const toAsset = ({ node }: PhotoIdentifier): MediaAsset => ({
  uri: node.image.uri,
  width: node.image.width || GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
  height: node.image.height || GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
  mime: node.type,
});

export const cameraRollGallery = {
  getAlbums: async (): Promise<MediaAlbum[]> => {
    const albums = await CameraRoll.getAlbums({
      assetType: ASSET_TYPE_PHOTOS,
      albumType: ALBUM_TYPE_ALBUM,
    });
    return albums.map(album => ({ title: album.title, count: album.count }));
  },

  getPhotos: async (params: {
    album?: string;
    after?: string;
    first: number;
  }): Promise<GalleryPage> => {
    const page = await CameraRoll.getPhotos({
      first: params.first,
      after: params.after,
      assetType: ASSET_TYPE_PHOTOS,
      groupName: params.album,
      include: INCLUDE_FIELDS,
    });
    return {
      assets: page.edges.map(toAsset),
      endCursor: page.page_info.end_cursor,
      hasNextPage: page.page_info.has_next_page,
    };
  },
};
