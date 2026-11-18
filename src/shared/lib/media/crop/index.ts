import { CropOptions, MediaAsset } from '@/shared/types/media.types';
import { computeCropRect, CropTransform } from './computeCropRect';
import { imageEditorCrop } from './imageEditorCrop';

export * from './computeCropRect';

// Crops what the user framed in the viewport; throws MediaError on failure
export const cropImage = (
  asset: MediaAsset,
  transform: CropTransform,
  options: CropOptions,
): Promise<MediaAsset> =>
  imageEditorCrop.crop(asset, computeCropRect(asset.width, asset.height, transform), options);
