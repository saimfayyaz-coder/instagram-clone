import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { API_ERROR_CODES } from '@/shared/constants';
import { showToast } from '@/shared/lib/toast/toastSlice';

// Global interceptor for network and 5xx server failures
export const errorInterceptorMiddleware: Middleware =
  store => next => action => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as any;
      const status = payload?.status;
      const errorCode = payload?.data?.code;

      if (status === 403 && errorCode !== API_ERROR_CODES.EMAIL_NOT_VERIFIED) {
        console.warn(
          '[ErrorInterceptor] Forbidden:',
          i18n.t(TRANSLATION_KEYS.ERROR_FORBIDDEN),
        );
      }

      if (status === 500 || status === 502 || status === 503) {
        console.warn(
          '[ErrorInterceptor] Server error:',
          i18n.t(TRANSLATION_KEYS.ERROR_SERVER),
        );
        store.dispatch(
          showToast({
            message: i18n.t(TRANSLATION_KEYS.ERROR_SERVER),
            type: 'error',
          }),
        );
      }

      if (status === API_ERROR_CODES.FETCH_ERROR) {
        console.warn(
          '[ErrorInterceptor] Network offline:',
          i18n.t(TRANSLATION_KEYS.ERROR_NETWORK),
        );
        store.dispatch(
          showToast({
            message: i18n.t(TRANSLATION_KEYS.ERROR_NETWORK),
            type: 'error',
          }),
        );
      }

      if (status === API_ERROR_CODES.TIMEOUT_ERROR) {
        console.warn(
          '[ErrorInterceptor] Request timeout:',
          i18n.t(TRANSLATION_KEYS.ERROR_TIMEOUT),
        );
        store.dispatch(
          showToast({
            message: i18n.t(TRANSLATION_KEYS.ERROR_TIMEOUT),
            type: 'error',
          }),
        );
      }
    }

    return next(action);
  };
