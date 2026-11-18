import { MediaAsset, UploadPreset } from '@/shared/types/media.types';
import { computeResizeSize } from './computeResizeSize';
import { imageEditorResize } from './imageEditorResize';

export * from './computeResizeSize';

const BYTES_PER_KB = 1024;

const toKb = (bytes?: number): string =>
  bytes === undefined ? '?' : `${Math.round(bytes / BYTES_PER_KB)} KB`;

// Makes sure an image is no bigger than the preset allows before it is uploaded.
// Images that already fit are sent as they are, so a cropped photo is not compressed twice.
// If resizing fails the original is returned: a larger upload beats a failed one.
export const prepareForUpload = async (
  asset: MediaAsset,
  preset: UploadPreset,
): Promise<MediaAsset> => {
  const target = computeResizeSize(asset.width, asset.height, preset.maxEdge);
  if (!target) {
    if (__DEV__) {
      console.log(`[upload] ${asset.width}x${asset.height}, ${toKb(asset.fileSize)} (no resize)`);
    }
    return asset;
  }

  try {
    const resized = await imageEditorResize.resize(asset, target, preset.quality);
    if (__DEV__) {
      console.log(
        `[upload] ${asset.width}x${asset.height}, ${toKb(asset.fileSize)} -> ` +
          `${resized.width}x${resized.height}, ${toKb(resized.fileSize)}`,
      );
    }
    return resized;
  } catch {
    return asset;
  }
};
