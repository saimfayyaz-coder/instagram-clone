import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { POST_ASPECT_RATIO_CYCLE, POST_LIMITS, PostAspectRatio } from '@/entities/post';
import { cropImage, CropTransform } from '@/shared/lib/media';
import { showToast } from '@/shared/lib/toast';
import { MediaAsset } from '@/shared/types';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { POST_CROP_BASE } from './constants';

type Framing = Pick<CropTransform, 'scale' | 'translateX' | 'translateY'>;

// What the hook needs from the crop viewport; matches media-picker's CropViewportHandle
interface FramingSource {
  getTransform: () => CropTransform;
}

const CENTRED: Framing = { scale: 1, translateX: 0, translateY: 0 };

// Picked photos in order, the previewed one, each one's framing, and the post shape
export const usePostMediaSelection = (firstGalleryPhoto: MediaAsset | undefined) => {
  const { t } = useTranslation();
  const viewportRef = useRef<FramingSource>(null);
  // Framing per photo uri, so switching photos keeps each one's crop
  const framings = useRef(new Map<string, CropTransform>());

  const [selected, setSelected] = useState<MediaAsset[]>([]);
  const [previewUri, setPreviewUri] = useState<string | undefined>();
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<PostAspectRatio>(POST_ASPECT_RATIO_CYCLE[0]);

  // Start with the newest photo, like Instagram
  useEffect(() => {
    if (firstGalleryPhoto && selected.length === 0) {
      setSelected([firstGalleryPhoto]);
      setPreviewUri(firstGalleryPhoto.uri);
    }
  }, [firstGalleryPhoto, selected.length]);

  const preview = useMemo(
    () => selected.find(photo => photo.uri === previewUri),
    [selected, previewUri],
  );

  const saveCurrentFraming = useCallback(() => {
    const transform = viewportRef.current?.getTransform();
    if (previewUri && transform) {
      framings.current.set(previewUri, transform);
    }
  }, [previewUri]);

  const selectPhoto = useCallback(
    (photo: MediaAsset) => {
      saveCurrentFraming();

      if (!isMultiSelect) {
        setSelected([photo]);
        setPreviewUri(photo.uri);
        return;
      }

      const isPicked = selected.some(item => item.uri === photo.uri);
      if (!isPicked) {
        if (selected.length >= POST_LIMITS.MAX_IMAGES) {
          showToast({ message: t(TRANSLATION_KEYS.CREATE_POST_MAX_IMAGES, { max: POST_LIMITS.MAX_IMAGES }) });
          return;
        }
        setSelected([...selected, photo]);
        setPreviewUri(photo.uri);
        return;
      }

      // Tapping the photo in the preview again unpicks it (one always stays)
      if (photo.uri === previewUri && selected.length > 1) {
        const remaining = selected.filter(item => item.uri !== photo.uri);
        framings.current.delete(photo.uri);
        setSelected(remaining);
        setPreviewUri(remaining[remaining.length - 1].uri);
        return;
      }

      setPreviewUri(photo.uri);
    },
    [isMultiSelect, previewUri, saveCurrentFraming, selected, t],
  );

  const toggleMultiSelect = useCallback(() => {
    if (isMultiSelect && preview) {
      setSelected([preview]);
    }
    setIsMultiSelect(current => !current);
  }, [isMultiSelect, preview]);

  const cycleAspectRatio = useCallback(() => {
    // Old framings were made for the old shape
    framings.current.clear();
    setAspectRatio(current => {
      const index = POST_ASPECT_RATIO_CYCLE.indexOf(current);
      return POST_ASPECT_RATIO_CYCLE[(index + 1) % POST_ASPECT_RATIO_CYCLE.length];
    });
  }, []);

  // Crops every picked photo, one at a time to keep memory low; throws MediaError on failure
  const cropSelected = useCallback(async (): Promise<MediaAsset[]> => {
    saveCurrentFraming();
    const viewport = viewportRef.current?.getTransform();
    if (!viewport) return [];

    const crop = { ...POST_CROP_BASE, aspect: aspectRatio };
    const results: MediaAsset[] = [];
    for (const photo of selected) {
      const framing = framings.current.get(photo.uri) ?? {
        ...CENTRED,
        viewportWidth: viewport.viewportWidth,
        viewportHeight: viewport.viewportHeight,
      };
      results.push(await cropImage(photo, framing, crop));
    }
    return results;
  }, [aspectRatio, saveCurrentFraming, selected]);

  return {
    viewportRef,
    selected,
    selectionOrder: useMemo(() => selected.map(photo => photo.uri), [selected]),
    preview,
    previewFraming: previewUri ? framings.current.get(previewUri) : undefined,
    isMultiSelect,
    aspectRatio,
    selectPhoto,
    toggleMultiSelect,
    cycleAspectRatio,
    cropSelected,
  };
};
