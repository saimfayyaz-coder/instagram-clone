import { ToastPosition, ToastType } from '@/shared/constants/ui';
import { createOverlayController } from '../overlay';

export interface ToastPayload {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
}

const controller = createOverlayController<ToastPayload>();

export const registerToast = controller.register;

export const showToast = (input: string | ToastPayload) =>
  controller.show(typeof input === 'string' ? { message: input } : input);
