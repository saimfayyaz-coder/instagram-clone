import { MediaAsset } from '@/shared/types';
import { PostUploadStatus } from './constants';

// Cropped photos waiting for a caption
export interface PostDraft {
  images: MediaAsset[];
  aspectRatio: number;
}

export interface PostDetails {
  caption: string;
  location: string;
  altTexts: string[];
}

export interface PostUpload extends PostDraft, PostDetails {
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
