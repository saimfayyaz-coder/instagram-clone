import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { API_ERROR_CODES } from '@/shared/constants';

/**
 * RTK Query Error Interceptor Middleware
 *
 * Fires on EVERY rejected RTK Query action (queries + mutations) globally.
 * Handles only GLOBAL side effects — inline form errors are handled by
 * react-hook-form's setError in the widget/page, NOT here.
 *
 * 401 → EXCLUDED: handled by baseQueryWithReauth (token refresh / session clear)
 * 403 → Global forbidden notification  (TODO: connect to global UI)
 * 500 → Global server error notification (TODO: connect to global UI)
 * FETCH_ERROR → Offline notification   (TODO: connect to global UI)
 */
export const errorInterceptorMiddleware: Middleware =
  _store => next => action => {
    if (isRejectedWithValue(action)) {
      const status = (action.payload as any)?.status;

      if (status === 403) {
        console.warn(
          '[ErrorInterceptor] Forbidden:',
          i18n.t(TRANSLATION_KEYS.ERROR_FORBIDDEN),
        );
        // TODO: dispatch(showGlobalBanner({ message: i18n.t(TRANSLATION_KEYS.ERROR_FORBIDDEN) }))
      }

      if (status === 500 || status === 502 || status === 503) {
        console.warn(
          '[ErrorInterceptor] Server error:',
          i18n.t(TRANSLATION_KEYS.ERROR_SERVER),
        );
        // TODO: dispatch(showGlobalBanner({ message: i18n.t(TRANSLATION_KEYS.ERROR_SERVER) }))
      }

      if (status === API_ERROR_CODES.FETCH_ERROR) {
        console.warn(
          '[ErrorInterceptor] Network offline:',
          i18n.t(TRANSLATION_KEYS.ERROR_NETWORK),
        );
        // TODO: dispatch(showOfflineBanner(true))
      }
    }

    return next(action);
  };
