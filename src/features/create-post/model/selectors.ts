import { POST_UPLOAD_STATUS } from './constants';
import { PostComposerState } from './types';

type StateWithComposer = { postComposer: PostComposerState };

export const selectPostDraft = (state: StateWithComposer) => state.postComposer.draft;
export const selectPostUpload = (state: StateWithComposer) => state.postComposer.upload;

// True while photos or the post are still being sent; a failed or finished upload doesn't block a new one
export const selectIsPostUploadBusy = (state: StateWithComposer) => {
  const status = state.postComposer.upload?.status;
  return status === POST_UPLOAD_STATUS.UPLOADING || status === POST_UPLOAD_STATUS.CREATING;
};
