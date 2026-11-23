import { MASK_SHAPES, UPLOAD_PRESETS } from '@/shared/constants';

export const POST_UPLOAD_STATUS = {
  UPLOADING: 'uploading',
  CREATING: 'creating',
  FAILED: 'failed',
  DONE: 'done',
} as const;

export type PostUploadStatus = (typeof POST_UPLOAD_STATUS)[keyof typeof POST_UPLOAD_STATUS];

export const CREATE_POST_CONFIG = {
  // How long the "shared" banner stays before it hides itself
  DONE_BANNER_MS: 2500,
} as const;

// Crop output; the aspect comes from the post's shape
export const POST_CROP_BASE = {
  mask: MASK_SHAPES.NONE,
  size: UPLOAD_PRESETS.POST.maxEdge,
  quality: UPLOAD_PRESETS.POST.quality,
} as const;
