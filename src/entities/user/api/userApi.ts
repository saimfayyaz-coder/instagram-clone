import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { User } from '../model/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ApiSuccessResponse<{ user: User }>, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetCurrentUserQuery, useLazyGetCurrentUserQuery } = userApi;
