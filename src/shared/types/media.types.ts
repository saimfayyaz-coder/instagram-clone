import { MaskShape } from '@/shared/constants/media';

export type { MaskShape };
export type MediaPickerMode = 'avatar' | 'post' | 'story';

export interface PickedImage {
  uri: string;
  fileName: string;
  type: string;
  size: number;
  width: number;
  height: number;
}

export interface MediaAlbum {
  title: string;
  count: number;
  coverUri?: string;
}

export interface MediaPickerConfig {
  mode: MediaPickerMode;
  allowMultiple?: boolean;
  maxSelection?: number;
  mediaType?: 'photo' | 'video' | 'all';
  cropAspectRatio?: number;
  maskShape?: MaskShape;
}

export const MEDIA_PERMISSION_STATUS = {
  GRANTED: 'granted',
  LIMITED: 'limited',
  DENIED: 'denied',
  BLOCKED: 'blocked',
  UNDETERMINED: 'undetermined',
} as const;

export type MediaPermissionStatus =
  (typeof MEDIA_PERMISSION_STATUS)[keyof typeof MEDIA_PERMISSION_STATUS];

// A local image file, whatever library produced it
export interface MediaAsset {
  uri: string;
  width: number;
  height: number;
  mime?: string;
  fileName?: string;
}

export interface CropOptions {
  // Width divided by height of the crop area
  aspect: number;
  mask: MaskShape;
  // Output width in pixels; height follows the aspect
  size: number;
  quality: number;
}
