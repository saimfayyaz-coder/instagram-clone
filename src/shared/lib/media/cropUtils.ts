import ImageEditor from '@react-native-community/image-editor';
import { PickedImage } from '../../types/media.types';
import { GALLERY_CONFIG } from '../../constants';

export interface CropCalculationParams {
  imageUri: string;
  originalWidth: number;
  originalHeight: number;
  viewportSize: number;
  scale: number;
  translateX: number;
  translateY: number;
  targetSize?: number;
}

export const cropImageToSquare = async ({
  imageUri,
  originalWidth,
  originalHeight,
  viewportSize,
  scale,
  translateX,
  translateY,
  targetSize = GALLERY_CONFIG.DEFAULT_TARGET_SIZE,
}: CropCalculationParams): Promise<PickedImage> => {
  // 1. Calculate base rendered size covering the viewport
  const baseScale = Math.max(
    viewportSize / originalWidth,
    viewportSize / originalHeight,
  );
  const renderedBaseWidth = originalWidth * baseScale;
  const renderedBaseHeight = originalHeight * baseScale;

  // 2. Apply user zoom
  const currentRenderedWidth = renderedBaseWidth * Math.max(scale, 1);
  const currentRenderedHeight = renderedBaseHeight * Math.max(scale, 1);

  // 3. Viewport offset relative to top-left of the scaled image
  const vpLeftOnRendered =
    (currentRenderedWidth - viewportSize) / 2 - translateX;
  const vpTopOnRendered =
    (currentRenderedHeight - viewportSize) / 2 - translateY;

  // 4. Convert rendered coordinates back to original image dimensions
  const ratio = originalWidth / currentRenderedWidth;
  const rawCropX = vpLeftOnRendered * ratio;
  const rawCropY = vpTopOnRendered * ratio;

  const cropX = Math.max(0, Math.min(rawCropX, originalWidth - 10));
  const cropY = Math.max(0, Math.min(rawCropY, originalHeight - 10));

  const maxAvailableWidth = originalWidth - cropX;
  const maxAvailableHeight = originalHeight - cropY;
  const idealCropSize = viewportSize * ratio;

  const cropSize = Math.max(
    10,
    Math.min(idealCropSize, maxAvailableWidth, maxAvailableHeight),
  );

  const cropData = {
    offset: {
      x: Math.round(cropX),
      y: Math.round(cropY),
    },
    size: {
      width: Math.round(cropSize),
      height: Math.round(cropSize),
    },
    displaySize: {
      width: targetSize,
      height: targetSize,
    },
  };

  const result = await ImageEditor.cropImage(imageUri, cropData);

  const fileName =
    imageUri.split('/').pop() || `avatar_${Date.now()}.jpg`;

  return {
    uri: result.uri,
    fileName,
    type: 'image/jpeg',
    size: 0,
    width: targetSize,
    height: targetSize,
  };
};
