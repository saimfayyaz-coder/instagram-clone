import { useCallback } from 'react';
import ImagePicker, { Image as CropImage, Options } from 'react-native-image-crop-picker';

export interface PickedImage {
  uri: string;
  fileName: string;
  type: string;
  size: number;
  width: number;
  height: number;
}

const formatCropImage = (image: CropImage): PickedImage => {
  const uri = image.path;
  const fileName =
    image.filename || uri.split('/').pop() || `avatar_${Date.now()}.jpg`;
  const type = image.mime || 'image/jpeg';
  const size = image.size;
  const width = image.width;
  const height = image.height;

  return {
    uri,
    fileName,
    type,
    size,
    width,
    height,
  };
};

const AVATAR_PICKER_OPTIONS: Options = {
  width: 500,
  height: 500,
  cropping: true,
  cropperCircleOverlay: true,
  compressImageQuality: 0.8,
  compressImageMaxWidth: 500,
  compressImageMaxHeight: 500,
  mediaType: 'photo',
  includeBase64: false,
};

export const useMediaPicker = () => {
  const pickAvatarFromGallery = useCallback(async (): Promise<PickedImage | null> => {
    try {
      const image = await ImagePicker.openPicker(AVATAR_PICKER_OPTIONS);
      return formatCropImage(image);
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') {
        return null;
      }
      throw error;
    }
  }, []);

  const captureAvatarFromCamera = useCallback(async (): Promise<PickedImage | null> => {
    try {
      const image = await ImagePicker.openCamera(AVATAR_PICKER_OPTIONS);
      return formatCropImage(image);
    } catch (error: any) {
      if (error?.code === 'E_PICKER_CANCELLED') {
        return null;
      }
      throw error;
    }
  }, []);

  const cleanTempImages = useCallback(async () => {
    try {
      await ImagePicker.clean();
    } catch {
      // Ignored if cleanup fails
    }
  }, []);

  return {
    pickAvatarFromGallery,
    captureAvatarFromCamera,
    cleanTempImages,
  };
};
