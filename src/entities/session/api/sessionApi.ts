import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { RefreshTokenRequest, RefreshTokenData, LogoutRequest } from '../model/types';

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshToken: builder.mutation<
      ApiSuccessResponse<RefreshTokenData>,
      RefreshTokenRequest
    >({
      query: (data) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Session'],
    }),
    logout: builder.mutation<ApiSuccessResponse<null>, LogoutRequest>({
      query: (data) => ({
        url: '/auth/logout',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Session', 'User'],
    }),
  }),
});

export const { useRefreshTokenMutation, useLogoutMutation } = sessionApi;
