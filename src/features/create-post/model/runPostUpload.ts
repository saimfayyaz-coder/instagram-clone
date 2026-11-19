import type { AppDispatch } from '@/app/store/store';
import { adjustPostsCount } from '@/entities/user';
import { prepareForUpload } from '@/shared/lib/media';
import { parseApiError } from '@/shared/lib/errors';
import { API_ERROR_CODES, UPLOAD_PRESETS } from '@/shared/constants';
import { createPostApi } from '../api/createPostApi';
import { buildPostImageFormData } from '../lib/buildPostImageFormData';
import { CREATE_POST_CONFIG, POST_UPLOAD_STATUS } from './constants';
import {
  postMediaUploaded,
  postUploadCleared,
  postUploadCreating,
  postUploadFailed,
  postUploadSucceeded,
} from './postComposerSlice';
import { PostComposerState } from './types';

type GetState = () => { postComposer: PostComposerState };

// Uploads the photos one at a time (so a weak phone never holds them all), then creates the post.
// Safe to run again after a failure: photos that already made it are skipped.
export const runPostUpload = () => async (dispatch: AppDispatch, getState: GetState) => {
  const runId = getState().postComposer.upload?.id;
  if (!runId) return;

  // Discard, logout or a newer post replaces the upload; this run then stops quietly
  const currentUpload = () => {
    const upload = getState().postComposer.upload;
    return upload?.id === runId ? upload : null;
  };

  try {
    const start = currentUpload();
    if (!start) return;

    for (let index = 0; index < start.images.length; index += 1) {
      const upload = currentUpload();
      if (!upload) return;
      if (upload.mediaIds[index]) continue;

      const image = await prepareForUpload(upload.images[index], UPLOAD_PRESETS.POST);
      const response = await dispatch(
        createPostApi.endpoints.uploadPostImage.initiate(
          buildPostImageFormData(image, upload.aspectRatio),
          { track: false },
        ),
      ).unwrap();

      if (!currentUpload()) return;
      dispatch(postMediaUploaded({ index, mediaId: response.data.media.id }));
    }

    dispatch(postUploadCreating());
    const upload = currentUpload();
    if (!upload) return;

    await dispatch(
      createPostApi.endpoints.createPost.initiate(
        {
          mediaIds: upload.mediaIds.filter((id): id is string => Boolean(id)),
          aspectRatio: upload.aspectRatio,
          caption: upload.caption,
          location: upload.location,
          altTexts: upload.altTexts,
          clientRequestId: upload.id,
        },
        { track: false },
      ),
    ).unwrap();

    if (!currentUpload()) return;
    dispatch(adjustPostsCount(1));
    dispatch(postUploadSucceeded());

    setTimeout(() => {
      if (currentUpload()?.status === POST_UPLOAD_STATUS.DONE) {
        dispatch(postUploadCleared());
      }
    }, CREATE_POST_CONFIG.DONE_BANNER_MS);
  } catch (error) {
    if (!currentUpload()) return;
    const parsed = parseApiError(error);
    dispatch(
      postUploadFailed({
        message: parsed.message,
        // The server dropped the uploaded photos (expired or used), so send them again
        resetMedia: parsed.code === API_ERROR_CODES.MEDIA_NOT_FOUND,
      }),
    );
  }
};
