import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import {
  User,
  UpdateProfilePayload,
  CheckUsernameResponseData,
} from '../model/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ApiSuccessResponse<{ user: User }>, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    checkUsername: builder.query<
      ApiSuccessResponse<CheckUsernameResponseData>,
      { username: string }
    >({
      query: ({ username }) => ({
        url: `/auth/check-username?username=${encodeURIComponent(username)}`,
        method: 'GET',
      }),
    }),

    updateProfile: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: '/users/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    uploadAvatar: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      FormData
    >({
      query: (formData) => ({
        url: '/users/profile/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    deleteAvatar: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      void
    >({
      query: () => ({
        url: '/users/profile/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useCheckUsernameQuery,
  useLazyCheckUsernameQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} = userApi;
