import { fetchBaseQuery, type FetchArgs } from '@reduxjs/toolkit/query/react';
import { authStorage } from './authStorage';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import {
  API_ERROR_CODES,
  HTTP_STATUS,
  API_TIMEOUT_MS,
  API_ENDPOINTS,
  HTTP_METHODS,
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

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2],
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === HTTP_STATUS.UNAUTHORIZED) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshToken = await authStorage.getRefreshToken();
        if (!refreshToken) {
          api.dispatch({ type: 'session/clearSession' });
          return {
            error: {
              status: HTTP_STATUS.UNAUTHORIZED,
              data: {
                success: false,
                message: i18n.t(TRANSLATION_KEYS.ERROR_REFRESH_TOKEN_EXPIRED),
                code: API_ERROR_CODES.REFRESH_TOKEN_EXPIRED,
              },
            },
          };
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

        if (refreshResult.data) {
          const response = refreshResult.data as {
            data: { accessToken: string };
          };
          const newAccessToken = response.data.accessToken;
          api.dispatch({
            type: 'session/setAccessToken',
            payload: newAccessToken,
          });
          onRefreshed(newAccessToken);
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch({ type: 'session/clearSession' });
          return {
            error: {
              status: HTTP_STATUS.UNAUTHORIZED,
              data: {
                success: false,
                message: i18n.t(TRANSLATION_KEYS.ERROR_REFRESH_TOKEN_EXPIRED),
                code: API_ERROR_CODES.REFRESH_TOKEN_EXPIRED,
              },
            },
          };
        }
      } catch {
        api.dispatch({ type: 'session/clearSession' });
        return {
          error: {
            status: HTTP_STATUS.UNAUTHORIZED,
            data: {
              success: false,
              message: i18n.t(TRANSLATION_KEYS.ERROR_TOKEN_INVALID),
              code: API_ERROR_CODES.TOKEN_INVALID,
            },
          },
        };
      } finally {
        isRefreshing = false;
      }
    } else {
      const newToken = await new Promise<string>(resolve => {
        subscribeTokenRefresh(resolve);
      });
      if (newToken) {
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  if (result.error) {
    const errString =
      typeof (result.error as any).error === 'string'
        ? (result.error as any).error
        : '';

    const shouldSkipGlobalToast =
      Boolean((extraOptions as any)?.skipGlobalErrorToast) ||
      (typeof args !== 'string' && Boolean((args as any)?.skipGlobalErrorToast));

    // React Native Hermes reports AbortError when fetchBaseQuery aborts at 15s
    if (
      result.error.status === API_ERROR_CODES.TIMEOUT_ERROR ||
      (result.error.status === API_ERROR_CODES.FETCH_ERROR &&
        (errString.includes('Abort') || errString.includes('timeout')))
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

