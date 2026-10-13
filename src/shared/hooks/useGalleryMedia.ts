import { useState, useCallback, useEffect, useRef } from 'react';
import {
  CameraRoll,
  PhotoIdentifier,
  GetPhotosParams,
} from '@react-native-camera-roll/camera-roll';
import { MediaAlbum } from '@/shared/types';
import {
  GALLERY_CONFIG,
  CAMERA_ROLL_ASSET_TYPE,
  CAMERA_ROLL_ALBUM_TYPE,
  CAMERA_ROLL_INCLUDE_FIELDS,
} from '@/shared/constants';

export interface GalleryPhotoItem {
  id: string;
  uri: string;
  width: number;
  height: number;
  filename: string;
  fileSize: number;
}

const formatNode = (item: PhotoIdentifier): GalleryPhotoItem => {
  const node = item.node;
  return {
    id: node.image.uri,
    uri: node.image.uri,
    width: node.image.width || GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
    height: node.image.height || GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
    filename: node.image.filename || `img_${Date.now()}.jpg`,
    fileSize: node.image.fileSize || 0,
  };
};

export const useGalleryMedia = (isPermissionGranted: boolean) => {
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>([]);
  const [albums, setAlbums] = useState<MediaAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>(
    GALLERY_CONFIG.RECENTS_ALBUM_TITLE,
  );
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const endCursor = useRef<string | undefined>(undefined);
  const isFetching = useRef(false);

  const fetchAlbums = useCallback(async () => {
    if (!isPermissionGranted) return;

    try {
      const result = await CameraRoll.getAlbums({
        assetType: CAMERA_ROLL_ASSET_TYPE.PHOTOS,
        albumType: CAMERA_ROLL_ALBUM_TYPE.ALBUM,
      });

      const albumList: MediaAlbum[] = result.map((alb) => ({
        title: alb.title,
        count: alb.count,
      }));

      // Calculate total count for Recents
      const totalPhotos = albumList.reduce((sum, item) => sum + item.count, 0);

      const allAlbums: MediaAlbum[] = [
        {
          title: GALLERY_CONFIG.RECENTS_ALBUM_TITLE,
          count: totalPhotos,
        },
        ...albumList,
      ];

      setAlbums(allAlbums);
    } catch {
      setAlbums([
        { title: GALLERY_CONFIG.RECENTS_ALBUM_TITLE, count: 0 },
      ]);
    }
  }, [isPermissionGranted]);

  const loadPhotos = useCallback(
    async (albumName: string, isInitial = false) => {
      if (!isPermissionGranted || isFetching.current) return;
      if (!isInitial && !hasNextPage) return;

      isFetching.current = true;
      if (isInitial) {
        setIsLoading(true);
        endCursor.current = undefined;
      } else {
        setIsLoadingMore(true);
      }

      try {
        const params: GetPhotosParams = {
          first: GALLERY_CONFIG.PAGE_SIZE,
          assetType: CAMERA_ROLL_ASSET_TYPE.PHOTOS,
          after: endCursor.current,
          include: [...CAMERA_ROLL_INCLUDE_FIELDS],
        };

        if (albumName !== GALLERY_CONFIG.RECENTS_ALBUM_TITLE) {
          params.groupName = albumName;
        }

        const data = await CameraRoll.getPhotos(params);
        const newItems = data.edges.map(formatNode);

        endCursor.current = data.page_info.end_cursor;
        setHasNextPage(data.page_info.has_next_page);

        setPhotos((prev) => {
          const combined = isInitial ? newItems : [...prev, ...newItems];
          if (isInitial && combined.length > 0) {
            setSelectedPhoto(combined[0]);
          }
          return combined;
        });
      } catch (err) {
        console.warn('Error fetching photos from CameraRoll:', err);
      } finally {
        isFetching.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [isPermissionGranted, hasNextPage],
  );

  const selectAlbum = useCallback(
    (albumName: string) => {
      setSelectedAlbum(albumName);
      loadPhotos(albumName, true);
    },
    [loadPhotos],
  );

  const loadMorePhotos = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasNextPage) {
      loadPhotos(selectedAlbum, false);
    }
  }, [isLoading, isLoadingMore, hasNextPage, loadPhotos, selectedAlbum]);

  const refreshPhotos = useCallback(() => {
    fetchAlbums();
    loadPhotos(selectedAlbum, true);
  }, [fetchAlbums, loadPhotos, selectedAlbum]);

  useEffect(() => {
    if (isPermissionGranted) {
      fetchAlbums();
      loadPhotos(GALLERY_CONFIG.RECENTS_ALBUM_TITLE, true);
    } else {
      setPhotos([]);
      setSelectedPhoto(null);
    }
  }, [isPermissionGranted]);

  return {
    photos,
    albums,
    selectedAlbum,
    selectedPhoto,
    setSelectedPhoto,
    selectAlbum,
    loadMorePhotos,
    refreshPhotos,
    isLoading,
    isLoadingMore,
    hasNextPage,
  };
};
