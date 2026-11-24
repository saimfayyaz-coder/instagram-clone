import { MediaAsset } from '@/shared/types';
import { PostUploadStatus } from './constants';

// Cropped photos, ready to upload
export interface PostMedia {
  images: MediaAsset[];
  aspectRatio: number;
}

// Photos picked for a new post; they're cropped in the background while the caption is written
export interface PostDraft {
  // Tells a late crop result apart from a newer draft
  id: string;
  aspectRatio: number;
  imageCount: number;
  // Null until cropping finishes
  images: MediaAsset[] | null;
  cropFailed: boolean;
}

export interface PostDetails {
  caption: string;
  location: string;
  altTexts: string[];
}

export interface PostUpload extends PostMedia, PostDetails {
  // Also sent as clientRequestId, so a retried create can't make a second post
  id: string;
  status: PostUploadStatus;
  // Server ids of photos already uploaded; a retry skips these
  mediaIds: (string | null)[];
  errorMessage: string | null;
}

export interface PostComposerState {
  draft: PostDraft | null;
  upload: PostUpload | null;
}
