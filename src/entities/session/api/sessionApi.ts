import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, HTTP_METHODS } from '@/shared/constants';
import { RefreshTokenRequest, RefreshTokenData, LogoutRequest } from '../model/types';

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshToken: builder.mutation<
      ApiSuccessResponse<RefreshTokenData>,
      RefreshTokenRequest
    >({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: HTTP_METHODS.POST,
        body: data,
      }),
      invalidatesTags: ['Session'],
    }),
    logout: builder.mutation<ApiSuccessResponse<null>, LogoutRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: HTTP_METHODS.POST,
        body: data,
      }),
      invalidatesTags: ['Session', 'User'],
    }),
  }),
});

export const { useRefreshTokenMutation, useLogoutMutation } = sessionApi;
