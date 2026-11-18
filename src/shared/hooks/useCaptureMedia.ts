import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MAIN_ROUTES, MEDIA_SOURCES, MediaSource } from '@/shared/constants';
import { CropOptions, MainStackParamList, MediaAsset } from '@/shared/types';
import { createMediaRequest, takePhotoWithPermission } from '@/shared/lib/media';

interface CaptureMediaOptions {
  source: MediaSource;
  crop: CropOptions;
}

// One way to get a cropped photo from the camera or the library; resolves null if the user backs out
export const useCaptureMedia = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return useCallback(
    async ({ source, crop }: CaptureMediaOptions): Promise<MediaAsset | null> => {
      if (source === MEDIA_SOURCES.CAMERA) {
        const photo = await takePhotoWithPermission();
        if (!photo) {
          return null;
        }
        const { id, promise } = createMediaRequest<MediaAsset>();
        navigation.navigate(MAIN_ROUTES.CROP_PHOTO, { requestId: id, asset: photo, crop });
        return promise;
      }

      const { id, promise } = createMediaRequest<MediaAsset>();
      navigation.navigate(MAIN_ROUTES.PROFILE_PHOTO_PICKER, { requestId: id, crop });
      return promise;
    },
    [navigation],
  );
};
