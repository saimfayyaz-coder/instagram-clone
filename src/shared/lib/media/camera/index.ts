import { MediaAsset } from '@/shared/types/media.types';
import { cropPickerCamera } from './cropPickerCamera';

// Throws MediaError (cancelled, permission_blocked, unavailable, failed)
export const takePhoto = (): Promise<MediaAsset> => cropPickerCamera.takePhoto();

export const cleanupCameraFiles = (): Promise<void> => cropPickerCamera.cleanup();
