import { useState, useCallback, useEffect, useRef } from 'react';
import { MediaAlbum, MediaAsset } from '@/shared/types';
import { GALLERY_CONFIG } from '@/shared/constants';
import { getAlbums, getPhotos } from '@/shared/lib/media';

const RECENTS_ALBUM: MediaAlbum = { title: GALLERY_CONFIG.RECENTS_ALBUM_TITLE };

export const useGalleryMedia = (isPermissionGranted: boolean) => {
  const [photos, setPhotos] = useState<MediaAsset[]>([]);
  const [albums, setAlbums] = useState<MediaAlbum[]>([RECENTS_ALBUM]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>(RECENTS_ALBUM.title);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const endCursor = useRef<string | undefined>(undefined);
  const isFetching = useRef(false);
  // Bumped on every fresh album load, so results of an older load are dropped
  const loadId = useRef(0);

  const fetchAlbums = useCallback(async () => {
    if (!isPermissionGranted) return;
    try {
      setAlbums([RECENTS_ALBUM, ...(await getAlbums())]);
    } catch {
      setAlbums([RECENTS_ALBUM]);
    }
  }, [isPermissionGranted]);

  const loadPhotos = useCallback(
    async (albumTitle: string, isInitial: boolean) => {
      if (!isPermissionGranted) return;
      if (!isInitial && (isFetching.current || !endCursor.current)) return;

      const currentLoad = isInitial ? ++loadId.current : loadId.current;
      isFetching.current = true;
      if (isInitial) {
        setIsLoading(true);
        endCursor.current = undefined;
      } else {
        setIsLoadingMore(true);
      }

      try {
        const page = await getPhotos({
          album: albumTitle === RECENTS_ALBUM.title ? undefined : albumTitle,
          after: endCursor.current,
          first: GALLERY_CONFIG.PAGE_SIZE,
        });
        if (currentLoad !== loadId.current) return;

        endCursor.current = page.hasNextPage ? page.endCursor : undefined;
        setHasNextPage(page.hasNextPage);
        if (isInitial) {
          setPhotos(page.assets);
          setSelectedPhoto(page.assets[0] ?? null);
        } else {
          setPhotos(prev => [...prev, ...page.assets]);
        }
      } catch {
        if (currentLoad === loadId.current && isInitial) {
          setPhotos([]);
        }
      } finally {
        if (currentLoad === loadId.current) {
          isFetching.current = false;
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [isPermissionGranted],
  );

  const selectAlbum = useCallback(
    (albumTitle: string) => {
      setSelectedAlbum(albumTitle);
      loadPhotos(albumTitle, true);
    },
    [loadPhotos],
  );

  const loadMorePhotos = useCallback(() => {
    loadPhotos(selectedAlbum, false);
  }, [loadPhotos, selectedAlbum]);

  const refreshPhotos = useCallback(() => {
    fetchAlbums();
    loadPhotos(selectedAlbum, true);
  }, [fetchAlbums, loadPhotos, selectedAlbum]);

  useEffect(() => {
    if (isPermissionGranted) {
      fetchAlbums();
      loadPhotos(RECENTS_ALBUM.title, true);
    } else {
      setPhotos([]);
      setSelectedPhoto(null);
    }
    // Initial load runs only when permission changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
