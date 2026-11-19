import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Post, useDeletePostMutation } from '@/entities/post';
import { adjustPostsCount } from '@/entities/user';
import { useAppDispatch } from '@/app/store/hooks';
import { showAlert } from '@/shared/lib/alert';
import { showToast } from '@/shared/lib/toast';
import { parseApiError } from '@/shared/lib/errors';
import { API_ERROR_CODES, ALERT_BUTTON_STYLES, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

// Asks first, then deletes; the post leaves the lists at once and returns if the server refuses
export const useDeletePost = (userId: string) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [deletePost] = useDeletePostMutation();

  const runDelete = useCallback(
    async (post: Post, onDeleted?: () => void) => {
      try {
        await deletePost({ postId: post.id, userId }).unwrap();
        dispatch(adjustPostsCount(-1));
        showToast({ message: t(TRANSLATION_KEYS.POST_DELETED) });
        onDeleted?.();
      } catch (error) {
        const parsed = parseApiError(error);
        // Already gone on the server, which is what the user wanted
        if (parsed.code === API_ERROR_CODES.POST_NOT_FOUND) {
          onDeleted?.();
          return;
        }
        showAlert({
          title: t(TRANSLATION_KEYS.POST_DELETE_FAILED_TITLE),
          message: parsed.message,
        });
      }
    },
    [deletePost, dispatch, t, userId],
  );

  const confirmDelete = useCallback(
    (post: Post, onDeleted?: () => void) => {
      showAlert({
        title: t(TRANSLATION_KEYS.POST_DELETE_CONFIRM_TITLE),
        message: t(TRANSLATION_KEYS.POST_DELETE_CONFIRM_MESSAGE),
        buttons: [
          { text: t(TRANSLATION_KEYS.COMMON_CANCEL), style: ALERT_BUTTON_STYLES.CANCEL },
          {
            text: t(TRANSLATION_KEYS.POST_DELETE),
            style: ALERT_BUTTON_STYLES.DESTRUCTIVE,
            testID: TEST_IDS.POST.DELETE_OPTION,
            onPress: () => runDelete(post, onDeleted),
          },
        ],
      });
    },
    [runDelete, t],
  );

  return { confirmDelete };
};
