import { MediaAsset } from '@/shared/types/media.types';
import {
  ALERT_BUTTON_STYLES,
  MEDIA_ERROR_CODES,
  PERMISSION_KINDS,
  PERMISSION_STATES,
  TOAST_TYPES,
} from '@/shared/constants';
import i18n from '../i18n/i18n';
import { TRANSLATION_KEYS } from '../i18n/translationKeys';
import { showAlert } from '../alert';
import { showToast } from '../toast';
import { takePhoto } from './camera';
import { isMediaError } from './mediaError';
import { ensurePermission, isPermissionUsable, openPermissionSettings } from './permissions';

const showCameraBlockedAlert = () =>
  showAlert({
    title: i18n.t(TRANSLATION_KEYS.MEDIA_PICKER_CAMERA_BLOCKED_TITLE),
    message: i18n.t(TRANSLATION_KEYS.MEDIA_PICKER_CAMERA_BLOCKED_MESSAGE),
    buttons: [
      { text: i18n.t(TRANSLATION_KEYS.COMMON_CANCEL), style: ALERT_BUTTON_STYLES.CANCEL },
      { text: i18n.t(TRANSLATION_KEYS.MEDIA_PICKER_OPEN_SETTINGS), onPress: openPermissionSettings },
    ],
  });

const showCameraError = (error: unknown) => {
  const code = isMediaError(error) ? error.code : MEDIA_ERROR_CODES.FAILED;

  if (code === MEDIA_ERROR_CODES.CANCELLED) {
    return;
  }
  if (code === MEDIA_ERROR_CODES.PERMISSION_BLOCKED || code === MEDIA_ERROR_CODES.PERMISSION_DENIED) {
    showCameraBlockedAlert();
    return;
  }
  showToast({
    message: i18n.t(
      code === MEDIA_ERROR_CODES.UNAVAILABLE
        ? TRANSLATION_KEYS.MEDIA_PICKER_CAMERA_UNAVAILABLE
        : TRANSLATION_KEYS.MEDIA_PICKER_CAMERA_FAILED,
    ),
    type: TOAST_TYPES.ERROR,
  });
};

// Asks for the camera if needed, takes a photo, and tells the user about any problem.
// Returns null when there's no photo (cancelled, denied or failed).
export const takePhotoWithPermission = async (): Promise<MediaAsset | null> => {
  const permission = await ensurePermission(PERMISSION_KINDS.CAMERA);
  if (permission === PERMISSION_STATES.BLOCKED) {
    showCameraBlockedAlert();
    return null;
  }
  if (!isPermissionUsable(permission)) {
    return null;
  }

  try {
    return await takePhoto();
  } catch (error) {
    showCameraError(error);
    return null;
  }
};
