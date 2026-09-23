import i18n from '../i18n/i18n';
import { TRANSLATION_KEYS } from '../i18n/translationKeys';
import { API_ERROR_CODES } from '@/shared/constants';
import type { AppError } from '@/shared/types/errors.types';

export interface ParsedApiError extends AppError {
  fieldErrors?: Record<string, string>;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const err = error as any;

    // RTK Query network / fetch failure
    if (err.status === API_ERROR_CODES.FETCH_ERROR) {
      return {
        message: i18n.t(TRANSLATION_KEYS.ERROR_NETWORK),
        code: API_ERROR_CODES.NETWORK_ERROR,
        status: 0,
      };
    }

    const data = err.data as {
      message?: string;
      code?: string;
      errors?: Record<string, string[]>;
    } | undefined;

    // Direct code → translation key lookup
    const serverCode = data?.code ?? API_ERROR_CODES.UNKNOWN;
    const i18nKey = `errors.${serverCode}`;
    const message = i18n.exists(i18nKey)
      ? i18n.t(i18nKey)
      : data?.message || i18n.t(TRANSLATION_KEYS.ERROR_UNKNOWN);

    // Flatten field errors: { email: ["msg1"] } or { email: "msg1" } → { email: "msg1" }
    const rawFieldErrors = data?.errors;
    const fieldErrors =
      rawFieldErrors && typeof rawFieldErrors === 'object' && Object.keys(rawFieldErrors).length > 0
        ? Object.fromEntries(
          Object.entries(rawFieldErrors).map(([field, msgs]) => [
            field,
            Array.isArray(msgs) ? msgs[0] ?? '' : typeof msgs === 'string' ? msgs : String(msgs),
          ]),
        )
        : undefined;

    return {
      message,
      code: serverCode,
      status: typeof err.status === 'number' ? err.status : undefined,
      fieldErrors,
    };
  }

  return {
    message: i18n.t(TRANSLATION_KEYS.ERROR_UNKNOWN),
    code: API_ERROR_CODES.UNKNOWN,
  };
}
