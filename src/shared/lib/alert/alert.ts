import { ALERT_BUTTON_STYLES, AlertButtonStyle } from '@/shared/constants/ui';
import i18n from '../i18n/i18n';
import { TRANSLATION_KEYS } from '../i18n/translationKeys';
import { createOverlayController } from '../overlay';

export interface AlertButton {
  text: string;
  style?: AlertButtonStyle;
  onPress?: () => void;
}

export interface AlertPayload {
  title?: string;
  message: string;
  buttons?: AlertButton[];
}

const controller = createOverlayController<AlertPayload>();

export const registerAlert = controller.register;

export const showAlert = (payload: AlertPayload) =>
  controller.show({
    ...payload,
    buttons: payload.buttons?.length
      ? payload.buttons
      : [{ text: i18n.t(TRANSLATION_KEYS.COMMON_OK), style: ALERT_BUTTON_STYLES.DEFAULT }],
  });
