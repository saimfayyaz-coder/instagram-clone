import ImageEditor from '@react-native-community/image-editor';
import { IMAGE_FORMATS, MEDIA_ERROR_CODES, MIME_TYPES } from '@/shared/constants';
import { CropOptions, MediaAsset } from '@/shared/types/media.types';
import { MediaError } from '../mediaError';
import { CropRect } from './computeCropRect';

export const imageEditorCrop = {
  crop: async (asset: MediaAsset, rect: CropRect, options: CropOptions): Promise<MediaAsset> => {
    const outputWidth = options.size;
    const outputHeight = Math.round(options.size / options.aspect);
    try {
      const result = await ImageEditor.cropImage(asset.uri, {
        offset: { x: rect.x, y: rect.y },
        size: { width: rect.width, height: rect.height },
        displaySize: { width: outputWidth, height: outputHeight },
        format: IMAGE_FORMATS.JPEG,
        quality: options.quality,
      });
      return {
        uri: result.uri,
        width: outputWidth,
        height: outputHeight,
        mime: MIME_TYPES.JPEG,
        fileName: result.name,
      };
    } catch (error) {
      throw new MediaError(MEDIA_ERROR_CODES.FAILED, (error as Error | null)?.message);
    }
  },
};
