import { MediaErrorCode } from '@/shared/constants/media';

// Adapters throw this, so callers never see a library's own error codes
export class MediaError extends Error {
  constructor(public readonly code: MediaErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'MediaError';
  }
}

export const isMediaError = (error: unknown): error is MediaError =>
  error instanceof MediaError;
