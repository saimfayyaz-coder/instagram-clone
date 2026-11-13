import ImagePicker from 'react-native-image-crop-picker';
import { MEDIA_ERROR_CODES, MediaErrorCode, MIME_TYPES } from '@/shared/constants';
import { MediaAsset } from '@/shared/types/media.types';
import { MediaError } from '../mediaError';

// The crop step compresses again, so keep the capture close to the original
const CAPTURE_QUALITY = 0.95;
const PHOTO_MEDIA_TYPE = 'photo';

const ERROR_CODE_MAP: Record<string, MediaErrorCode> = {
  E_PICKER_CANCELLED: MEDIA_ERROR_CODES.CANCELLED,
  E_NO_CAMERA_PERMISSION: MEDIA_ERROR_CODES.PERMISSION_BLOCKED,
  E_CAMERA_IS_NOT_AVAILABLE: MEDIA_ERROR_CODES.UNAVAILABLE,
  E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR: MEDIA_ERROR_CODES.UNAVAILABLE,
};

const toMediaError = (error: unknown): MediaError => {
  const code = (error as { code?: string } | null)?.code;
  const mapped = (code && ERROR_CODE_MAP[code]) || MEDIA_ERROR_CODES.FAILED;
  return new MediaError(mapped, (error as Error | null)?.message);
};

export const cropPickerCamera = {
  takePhoto: async (): Promise<MediaAsset> => {
    try {
      const image = await ImagePicker.openCamera({
        mediaType: PHOTO_MEDIA_TYPE,
        cropping: false,
        compressImageQuality: CAPTURE_QUALITY,
      });
      return {
        uri: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime || MIME_TYPES.JPEG,
        fileName: image.filename ?? image.path.split('/').pop(),
      };
    } catch (error) {
      throw toMediaError(error);
    }
  },

  // Deletes the photos this library saved in the app cache
  cleanup: async (): Promise<void> => {
    try {
      await ImagePicker.clean();
    } catch {
      // Nothing to clean, or already cleaned
    }
  },
};
