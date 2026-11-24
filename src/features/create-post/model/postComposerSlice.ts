import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SESSION_ACTION_TYPES } from '@/shared/constants';
import { POST_UPLOAD_STATUS } from './constants';
import { MediaAsset } from '@/shared/types';
import { PostComposerState, PostDetails, PostMedia } from './types';

const initialState: PostComposerState = {
  draft: null,
  upload: null,
};

// Kept in memory only: an upload doesn't survive an app restart
export const postComposerSlice = createSlice({
  name: 'postComposer',
  initialState,
  reducers: {
    postDraftStarted: (
      state,
      action: PayloadAction<{ id: string; aspectRatio: number; imageCount: number }>,
    ) => {
      state.draft = { ...action.payload, images: null, cropFailed: false };
    },
    postDraftCropped: (state, action: PayloadAction<{ id: string; images: MediaAsset[] }>) => {
      if (state.draft?.id === action.payload.id) {
        state.draft.images = action.payload.images;
      }
    },
    postDraftCropFailed: (state, action: PayloadAction<{ id: string }>) => {
      if (state.draft?.id === action.payload.id) {
        state.draft.cropFailed = true;
      }
    },
    clearPostDraft: state => {
      state.draft = null;
    },
    postUploadStarted: (
      state,
      action: PayloadAction<PostMedia & PostDetails & { id: string }>,
    ) => {
      state.upload = {
        ...action.payload,
        status: POST_UPLOAD_STATUS.UPLOADING,
        mediaIds: action.payload.images.map(() => null),
        errorMessage: null,
      };
    },
    postMediaUploaded: (state, action: PayloadAction<{ index: number; mediaId: string }>) => {
      if (state.upload) {
        state.upload.mediaIds[action.payload.index] = action.payload.mediaId;
      }
    },
    postUploadCreating: state => {
      if (state.upload) {
        state.upload.status = POST_UPLOAD_STATUS.CREATING;
      }
    },
    postUploadFailed: (
      state,
      action: PayloadAction<{ message: string; resetMedia?: boolean }>,
    ) => {
      if (state.upload) {
        state.upload.status = POST_UPLOAD_STATUS.FAILED;
        state.upload.errorMessage = action.payload.message;
        if (action.payload.resetMedia) {
          state.upload.mediaIds = state.upload.images.map(() => null);
        }
      }
    },
    postUploadRetried: state => {
      if (state.upload) {
        state.upload.status = POST_UPLOAD_STATUS.UPLOADING;
        state.upload.errorMessage = null;
      }
    },
    postUploadSucceeded: state => {
      if (state.upload) {
        state.upload.status = POST_UPLOAD_STATUS.DONE;
      }
    },
    postUploadCleared: state => {
      state.upload = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(SESSION_ACTION_TYPES.CLEAR_SESSION, () => initialState);
  },
});

export const {
  postDraftStarted,
  postDraftCropped,
  postDraftCropFailed,
  clearPostDraft,
  postUploadStarted,
  postMediaUploaded,
  postUploadCreating,
  postUploadFailed,
  postUploadRetried,
  postUploadSucceeded,
  postUploadCleared,
} = postComposerSlice.actions;

export const postComposerReducer = postComposerSlice.reducer;
