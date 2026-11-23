import { useCallback } from 'react';
import { MAIN_ROUTES, MEDIA_SOURCES, MediaSource } from '@/shared/constants';
import { CropOptions, MediaAsset } from '@/shared/types';
import { createMediaRequest, takePhotoWithPermission } from '@/shared/lib/media';
import { navigationRef, waitForNavigationReady } from '@/shared/lib/navigation';

interface CaptureMediaOptions {
  source: MediaSource;
  crop: CropOptions;
}

// One way to get a cropped photo from the camera or the library; resolves null if the user backs out
export const useCaptureMedia = () =>
  useCallback(async ({ source, crop }: CaptureMediaOptions): Promise<MediaAsset | null> => {
    if (source === MEDIA_SOURCES.CAMERA) {
      const photo = await takePhotoWithPermission();
      if (!photo) {
        return null;
      }
      // Android may have rebuilt the app's screen while the camera was open; wait for the new
      // navigator and use it, since the one that opened the camera is gone
      if (!(await waitForNavigationReady())) {
        return null;
      }
      const { id, promise } = createMediaRequest<MediaAsset>();
      navigationRef.navigate(MAIN_ROUTES.CROP_PHOTO, { requestId: id, asset: photo, crop });
      return promise;
    }

    if (!navigationRef.isReady()) {
      return null;
    }
    const { id, promise } = createMediaRequest<MediaAsset>();
    navigationRef.navigate(MAIN_ROUTES.PROFILE_PHOTO_PICKER, { requestId: id, crop });
    return promise;
  }, []);
