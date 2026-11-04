export type MediaPickerMode = 'avatar' | 'post' | 'story';
export type MaskShape = 'circle' | 'square' | 'none';

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
