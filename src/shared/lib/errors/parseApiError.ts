import i18n from '../i18n/i18n';
import { TRANSLATION_KEYS } from '../i18n/translationKeys';
import { API_ERROR_CODES, HTTP_STATUS } from '@/shared/constants';
import type { AppError } from '@/shared/types/errors.types';

export interface ParsedApiError extends AppError {
  fieldErrors?: Record<string, string>;
  raw?: unknown;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const err = error as any;

    if (err.status === API_ERROR_CODES.FETCH_ERROR) {
      return {
        message: i18n.t(TRANSLATION_KEYS.ERROR_NETWORK),
        code: API_ERROR_CODES.NETWORK_ERROR,
        status: 0,
        raw: error,
      };
    }

    if (err.status === API_ERROR_CODES.TIMEOUT_ERROR) {
      return {
        message: i18n.t(TRANSLATION_KEYS.ERROR_TIMEOUT),
        code: API_ERROR_CODES.TIMEOUT_ERROR,
        status: 0,
        raw: error,
      };
    }

    if (err.status === API_ERROR_CODES.PARSING_ERROR) {
      const httpStatus =
        typeof err.originalStatus === 'number'
          ? err.originalStatus
          : HTTP_STATUS.INTERNAL_SERVER_ERROR;
      return {
        message: i18n.t(TRANSLATION_KEYS.ERROR_SERVER),
        code: API_ERROR_CODES.SERVER_ERROR,
        status: httpStatus,
        raw: error,
      };
    }

    const data = err.data as {
      message?: string;
      code?: string;
      errorCode?: string;
      errors?: Record<string, string[]>;
    } | undefined;

    const serverCode = data?.code ?? data?.errorCode ?? API_ERROR_CODES.UNKNOWN;
    const i18nKey = `errors.${serverCode}`;
    const message = i18n.exists(i18nKey)
      ? i18n.t(i18nKey)
      : data?.message || i18n.t(TRANSLATION_KEYS.ERROR_UNKNOWN);

    const rawFieldErrors = data?.errors;
    const fieldErrors =
      rawFieldErrors && typeof rawFieldErrors === 'object' && Object.keys(rawFieldErrors).length > 0
        ? Object.fromEntries(
            Object.entries(rawFieldErrors).map(([field, msgs]) => {
              const raw = Array.isArray(msgs) ? msgs[0] ?? '' : String(msgs);
              const directCodeKey = `errors.${raw}`;

              // Direct ErrorCode match
              if (i18n.exists(directCodeKey)) {
                return [field, i18n.t(directCodeKey)];
              }

              // Fallback to serverCode translation if available
              if (serverCode && serverCode !== API_ERROR_CODES.UNKNOWN && i18n.exists(`errors.${serverCode}`)) {
                return [field, i18n.t(`errors.${serverCode}`)];
              }

              return [field, raw];
            }),
          )
        : undefined;

    return {
      message,
      code: serverCode,
      status:
        typeof err.status === 'number'
          ? err.status
          : typeof err.originalStatus === 'number'
          ? err.originalStatus
          : undefined,
      fieldErrors,
      raw: error,
    };
  }

  return {
    message: i18n.t(TRANSLATION_KEYS.ERROR_UNKNOWN),
    code: API_ERROR_CODES.UNKNOWN,
    raw: error,
  };
}
