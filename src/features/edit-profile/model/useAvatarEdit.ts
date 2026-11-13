import { useCallback } from 'react';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  setPendingAvatar,
  clearPendingAvatar,
} from '@/entities/user';
import { useAppDispatch } from '@/app/store/hooks';
import { cleanupCameraFiles } from '@/shared/lib/media';
import { showToast } from '@/shared/lib/toast';
import { showAlert } from '@/shared/lib/alert';
import { MediaAsset } from '@/shared/types';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import {
  API_ERROR_CODES,
  isAndroid,
  MIME_TYPES,
  TOAST_POSITIONS,
  UPLOAD_FIELDS,
} from '@/shared/constants';
import { parseApiError } from '@/shared/lib/errors';

export const useAvatarEdit = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const resolveErrorMessage = useCallback(
    (err: unknown): string => {
      const parsed = parseApiError(err);

      if (
        parsed.code === API_ERROR_CODES.NETWORK_ERROR ||
        (err as any)?.status === API_ERROR_CODES.FETCH_ERROR
      ) {
        return t(TRANSLATION_KEYS.PROFILE_AVATAR_NETWORK_ERROR);
      }

      if (
        parsed.code === API_ERROR_CODES.TIMEOUT_ERROR ||
        (err as any)?.status === API_ERROR_CODES.TIMEOUT_ERROR
      ) {
        return t(TRANSLATION_KEYS.ERROR_TIMEOUT);
      }

      if (
        parsed.code === API_ERROR_CODES.SERVER_ERROR ||
        (typeof parsed.status === 'number' && parsed.status >= 500)
      ) {
        return t(TRANSLATION_KEYS.ERROR_SERVER);
      }

      if (parsed.message && parsed.message !== t(TRANSLATION_KEYS.ERROR_UNKNOWN)) {
        return parsed.message;
      }

      return t(TRANSLATION_KEYS.ERROR_UNKNOWN);
    },
    [t],
  );

  const handleSelectImage = useCallback(
    async (image: MediaAsset) => {
      dispatch(setPendingAvatar(image.uri));

      const formData = new FormData();
      const fileUri =
        isAndroid ? image.uri : image.uri.replace('file://', '');

      formData.append(UPLOAD_FIELDS.AVATAR, {
        uri: fileUri,
        name: image.fileName || `avatar-${Date.now()}.jpg`,
        type: image.mime || MIME_TYPES.JPEG,
      } as unknown as Blob);

      try {
        const response = await uploadAvatar(formData).unwrap();
        const uploadedUrl = response.data.user.avatar?.url;
        // Swap to the uploaded photo only once it's downloaded, so the avatar doesn't flash
        if (uploadedUrl) {
          await Image.prefetch(uploadedUrl).catch(() => false);
        }
        showToast({
          message: t(TRANSLATION_KEYS.PROFILE_AVATAR_UPDATE_SUCCESS),
          position: TOAST_POSITIONS.MIDDLE,
        });
      } catch (err) {
        showAlert({
          title: t(TRANSLATION_KEYS.PROFILE_AVATAR_UPDATE_ERROR_TITLE),
          message: resolveErrorMessage(err),
          buttons: [{ text: t(TRANSLATION_KEYS.COMMON_OK) }],
        });
      } finally {
        dispatch(clearPendingAvatar());
        cleanupCameraFiles();
      }
    },
    [dispatch, uploadAvatar, resolveErrorMessage, t],
  );

  const handleRemoveAvatar = useCallback(async () => {
    try {
      await deleteAvatar().unwrap();
      showToast({
        message: t(TRANSLATION_KEYS.PROFILE_AVATAR_REMOVE_SUCCESS),
        position: TOAST_POSITIONS.MIDDLE,
      });
    } catch (err) {
      const errorMessage = resolveErrorMessage(err);
      showAlert({
        title: t(TRANSLATION_KEYS.PROFILE_AVATAR_REMOVE_ERROR_TITLE),
        message: errorMessage,
        buttons: [{ text: t(TRANSLATION_KEYS.COMMON_OK) }],
      });
    }
  }, [deleteAvatar, resolveErrorMessage, t]);

  return {
    handleSelectImage,
    handleRemoveAvatar,
  };
};

