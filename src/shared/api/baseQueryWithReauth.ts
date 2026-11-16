import { fetchBaseQuery, type FetchArgs } from '@reduxjs/toolkit/query/react';
import { authStorage } from './authStorage';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import {
  API_ERROR_CODES,
  HTTP_STATUS,
  API_TIMEOUT_MS,
  TIMEOUT_ERROR_MESSAGES,
  API_ENDPOINTS,
  HTTP_METHODS,
  NO_REAUTH_ENDPOINTS,
  SESSION_ACTION_TYPES,
} from '@/shared/constants';
import { BASE_URL } from '@/shared/config';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: API_TIMEOUT_MS,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as any)?.session?.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

type BaseQueryApi = Parameters<typeof baseQuery>[1];
type BaseQueryExtraOptions = Parameters<typeof baseQuery>[2];
type RefreshResult = { accessToken: string } | { errorCode: string };

// Shared by every request that gets a 401 while a refresh is in flight
let refreshPromise: Promise<RefreshResult> | null = null;

const refreshAccessToken = async (
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions,
): Promise<RefreshResult> => {
  try {
    const refreshToken = await authStorage.getRefreshToken();
    if (!refreshToken) {
      api.dispatch({ type: SESSION_ACTION_TYPES.CLEAR_SESSION });
      return { errorCode: API_ERROR_CODES.REFRESH_TOKEN_EXPIRED };
    }

    const refreshResult = await baseQuery(
      {
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: HTTP_METHODS.POST,
        body: { refreshToken },
      },
      api,
      extraOptions,
    );

    if (!refreshResult.data) {
      api.dispatch({ type: SESSION_ACTION_TYPES.CLEAR_SESSION });
      return { errorCode: API_ERROR_CODES.REFRESH_TOKEN_EXPIRED };
    }

    const response = refreshResult.data as { data: { accessToken: string } };
    const accessToken = response.data.accessToken;
    api.dispatch({ type: SESSION_ACTION_TYPES.SET_ACCESS_TOKEN, payload: accessToken });
    return { accessToken };
  } catch {
    api.dispatch({ type: SESSION_ACTION_TYPES.CLEAR_SESSION });
    return { errorCode: API_ERROR_CODES.TOKEN_INVALID };
  }
};

const sessionErrorMessage = (errorCode: string) =>
  errorCode === API_ERROR_CODES.TOKEN_INVALID
    ? i18n.t(TRANSLATION_KEYS.ERROR_TOKEN_INVALID)
    : i18n.t(TRANSLATION_KEYS.ERROR_REFRESH_TOKEN_EXPIRED);

const getRequestUrl = (args: string | FetchArgs) => (typeof args === 'string' ? args : args.url);

export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error?.status === HTTP_STATUS.UNAUTHORIZED &&
    !NO_REAUTH_ENDPOINTS.includes(getRequestUrl(args))
  ) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken(api, extraOptions).finally(() => {
        refreshPromise = null;
      });
    }
    const refresh = await refreshPromise;

    if ('errorCode' in refresh) {
      return {
        error: {
          status: HTTP_STATUS.UNAUTHORIZED,
          data: {
            success: false,
            message: sessionErrorMessage(refresh.errorCode),
            code: refresh.errorCode,
          },
        },
      };
    }

    result = await baseQuery(args, api, extraOptions);
  }

  if (result.error) {
    const errString =
      typeof (result.error as any).error === 'string'
        ? (result.error as any).error
        : '';

    const shouldSkipGlobalToast = Boolean(
      (extraOptions as any)?.skipGlobalErrorToast ||
        (typeof args !== 'string' && (args as any)?.skipGlobalErrorToast),
    );

    // React Native Hermes reports AbortError when fetchBaseQuery aborts at 15s
    if (
      result.error.status === API_ERROR_CODES.TIMEOUT_ERROR ||
      (result.error.status === API_ERROR_CODES.FETCH_ERROR &&
        TIMEOUT_ERROR_MESSAGES.some((msg) => errString.includes(msg)))
    ) {
      return {
        ...result,
        error: {
          status: API_ERROR_CODES.TIMEOUT_ERROR,
          skipGlobalErrorToast: shouldSkipGlobalToast,
          data: {
            success: false,
            message: i18n.t(TRANSLATION_KEYS.ERROR_TIMEOUT),
            code: API_ERROR_CODES.TIMEOUT_ERROR,
            skipGlobalErrorToast: shouldSkipGlobalToast,
          },
        },
        meta: {
          ...(result.meta as any),
          skipGlobalErrorToast: shouldSkipGlobalToast,
        },
      };
    }

    if (!result.error.status || result.error.status === API_ERROR_CODES.FETCH_ERROR) {
      return {
        ...result,
        error: {
          status: API_ERROR_CODES.FETCH_ERROR,
          skipGlobalErrorToast: shouldSkipGlobalToast,
          data: {
            success: false,
            message: i18n.t(TRANSLATION_KEYS.ERROR_NETWORK),
            code: API_ERROR_CODES.NETWORK_ERROR,
            skipGlobalErrorToast: shouldSkipGlobalToast,
          },
        },
        meta: {
          ...(result.meta as any),
          skipGlobalErrorToast: shouldSkipGlobalToast,
        },
      };
    }

    return {
      ...result,
      error: {
        ...(result.error as any),
        skipGlobalErrorToast: shouldSkipGlobalToast,
      },
      meta: {
        ...(result.meta as any),
        skipGlobalErrorToast: shouldSkipGlobalToast,
      },
    };
  }

  return result;
};

