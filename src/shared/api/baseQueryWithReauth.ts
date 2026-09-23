import { fetchBaseQuery, type FetchArgs } from '@reduxjs/toolkit/query/react';
import { authStorage } from './authStorage';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { BASE_URL } from '@/shared/config';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
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

  if (result.error?.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshToken = await authStorage.getRefreshToken();
        if (!refreshToken) {
          api.dispatch({ type: 'session/clearSession' });
          return {
            error: {
              status: 401,
              data: {
                success: false,
                message: i18n.t(TRANSLATION_KEYS.ERROR_REFRESH_TOKEN_EXPIRED),
                code: 'REFRESH_TOKEN_EXPIRED',
              },
            },
          };
        }

        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh-token',
            method: 'POST',
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
              status: 401,
              data: {
                success: false,
                message: i18n.t(TRANSLATION_KEYS.ERROR_REFRESH_TOKEN_EXPIRED),
                code: 'REFRESH_TOKEN_EXPIRED',
              },
            },
          };
        }
      } catch (error) {
        api.dispatch({ type: 'session/clearSession' });
        return {
          error: {
            status: 401,
            data: {
              success: false,
              message: i18n.t(TRANSLATION_KEYS.ERROR_TOKEN_INVALID),
              code: 'TOKEN_INVALID',
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

  if (result.error && !result.error.status) {
    return {
      error: {
        status: 'FETCH_ERROR',
        data: {
          success: false,
          message: i18n.t(TRANSLATION_KEYS.ERROR_NETWORK),
          code: 'NETWORK_ERROR',
        },
      },
    };
  }

  return result;
};
