import ImageEditor from '@react-native-community/image-editor';
import { IMAGE_FORMATS, MEDIA_ERROR_CODES, MIME_TYPES } from '@/shared/constants';
import { MediaAsset } from '@/shared/types/media.types';
import { MediaError } from '../mediaError';
import { ImageSize } from './computeResizeSize';

export const imageEditorResize = {
  // Keeps the whole frame and only scales it; the native side decodes at a reduced size,
  // so a large photo never sits in memory at full resolution
  resize: async (asset: MediaAsset, target: ImageSize, quality: number): Promise<MediaAsset> => {
    try {
      const result = await ImageEditor.cropImage(asset.uri, {
        offset: { x: 0, y: 0 },
        size: { width: asset.width, height: asset.height },
        displaySize: target,
        format: IMAGE_FORMATS.JPEG,
        quality,
      });
      return {
        uri: result.uri,
        width: target.width,
        height: target.height,
        mime: MIME_TYPES.JPEG,
        fileName: result.name,
        fileSize: result.size,
      };
    } catch (error) {
      throw new MediaError(MEDIA_ERROR_CODES.FAILED, (error as Error | null)?.message);
    }
  },
};
