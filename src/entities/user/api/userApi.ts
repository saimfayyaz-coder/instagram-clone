import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, HTTP_METHODS } from '@/shared/constants';
import {
  User,
  UpdateProfilePayload,
  CheckUsernameResponseData,
} from '../model/types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<ApiSuccessResponse<{ user: User }>, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.ME,
        method: HTTP_METHODS.GET,
      }),
      providesTags: ['User'],
    }),

    checkUsername: builder.query<
      ApiSuccessResponse<CheckUsernameResponseData>,
      { username: string }
    >({
      query: ({ username }) => ({
        url: API_ENDPOINTS.AUTH.CHECK_USERNAME(username),
        method: HTTP_METHODS.GET,
      }),
    }),

    updateProfile: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: API_ENDPOINTS.USERS.PROFILE,
        method: HTTP_METHODS.PATCH,
        body,
      }),
      invalidatesTags: ['User'],
    }),

    uploadAvatar: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      FormData
    >({
      query: (formData) => ({
        url: API_ENDPOINTS.USERS.AVATAR,
        method: HTTP_METHODS.POST,
        body: formData,
      }),
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      invalidatesTags: ['User'],
    }),

    deleteAvatar: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      void
    >({
      query: () => ({
        url: API_ENDPOINTS.USERS.AVATAR,
        method: HTTP_METHODS.DELETE,
      }),
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      invalidatesTags: ['User'],
    }),

    addLink: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      { url: string; title?: string }
    >({
      query: (body) => ({
        url: API_ENDPOINTS.USERS.LINKS,
        method: HTTP_METHODS.POST,
        body,
      }),
      invalidatesTags: ['User'],
    }),

    editLink: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      { linkId: string; url: string; title?: string }
    >({
      query: ({ linkId, ...body }) => ({
        url: API_ENDPOINTS.USERS.LINK(linkId),
        method: HTTP_METHODS.PATCH,
        body,
      }),
      invalidatesTags: ['User'],
    }),

    deleteLink: builder.mutation<
      ApiSuccessResponse<{ user: User }>,
      { linkId: string }
    >({
      query: ({ linkId }) => ({
        url: API_ENDPOINTS.USERS.LINK(linkId),
        method: HTTP_METHODS.DELETE,
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
  useAddLinkMutation,
  useEditLinkMutation,
  useDeleteLinkMutation,
} = userApi;
