export const GALLERY_CONFIG = {
  PAGE_SIZE: 40,
  RECENTS_ALBUM_TITLE: 'Recents',
  DEFAULT_IMAGE_DIMENSION: 1080,
  DEFAULT_TARGET_SIZE: 500,
  MIN_PINCH_ZOOM: 1.0,
  MAX_PINCH_ZOOM: 3.5,
} as const;

export const MASK_SHAPES = {
  CIRCLE: 'circle',
  SQUARE: 'square',
  NONE: 'none',
} as const;

export type MaskShape = (typeof MASK_SHAPES)[keyof typeof MASK_SHAPES];

export const CAMERA_ROLL_ASSET_TYPE = {
  PHOTOS: 'Photos',
  VIDEOS: 'Videos',
  ALL: 'All',
} as const;

export const CAMERA_ROLL_ALBUM_TYPE = {
  ALBUM: 'Album',
  ALL: 'All',
  SMART_ALBUM: 'SmartAlbum',
} as const;

export const CAMERA_ROLL_INCLUDE_FIELDS = [
  'filename',
  'fileSize',
  'imageSize',
] as const;

export const MEDIA_PICKER_ERROR_CODE = {
  CANCELLED: 'E_PICKER_CANCELLED',
  NO_CAMERA_PERMISSION: 'E_NO_CAMERA_PERMISSION',
  NO_LIBRARY_PERMISSION: 'E_NO_LIBRARY_PERMISSION',
  PICKER_CANNOT_RUN: 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR',
  CANNOT_SAVE_IMAGE: 'E_CANNOT_SAVE_IMAGE_TO_GALLERY',
} as const;

export const MEDIA_SOURCES = {
  CAMERA: 'camera',
  LIBRARY: 'library',
} as const;

export type MediaSource = (typeof MEDIA_SOURCES)[keyof typeof MEDIA_SOURCES];

export const MEDIA_ERROR_CODES = {
  CANCELLED: 'cancelled',
  PERMISSION_DENIED: 'permission_denied',
  PERMISSION_BLOCKED: 'permission_blocked',
  UNAVAILABLE: 'unavailable',
  FAILED: 'failed',
} as const;

export type MediaErrorCode = (typeof MEDIA_ERROR_CODES)[keyof typeof MEDIA_ERROR_CODES];

export const PERMISSION_KINDS = {
  CAMERA: 'camera',
  PHOTOS: 'photos',
} as const;

export type PermissionKind = (typeof PERMISSION_KINDS)[keyof typeof PERMISSION_KINDS];

export const PERMISSION_STATES = {
  CHECKING: 'checking',
  GRANTED: 'granted',
  LIMITED: 'limited',
  // Not granted, but the system dialog can still be shown
  DENIED: 'denied',
  // Only the Settings app can grant it now
  BLOCKED: 'blocked',
} as const;

export type PermissionState = (typeof PERMISSION_STATES)[keyof typeof PERMISSION_STATES];

export const MIME_TYPES = {
  JPEG: 'image/jpeg',
} as const;

export const IMAGE_FORMATS = {
  JPEG: 'jpeg',
} as const;

export const UPLOAD_FIELDS = {
  AVATAR: 'avatar',
} as const;

export const CROP_PRESETS = {
  AVATAR: {
    aspect: 1,
    mask: MASK_SHAPES.CIRCLE,
    size: 500,
    quality: 0.95,
  },
} as const;
