import { ALERT_BUTTON_STYLES, AlertButtonStyle } from '@/shared/constants/ui';
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

const DEFAULT_BUTTONS: AlertButton[] = [{ text: 'OK', style: ALERT_BUTTON_STYLES.DEFAULT }];

const controller = createOverlayController<AlertPayload>();

export const registerAlert = controller.register;

export const showAlert = (payload: AlertPayload) =>
  controller.show({
    ...payload,
    buttons: payload.buttons?.length ? payload.buttons : DEFAULT_BUTTONS,
  });
