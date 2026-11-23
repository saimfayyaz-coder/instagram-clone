import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, FOLLOW_LIST_TYPES, HTTP_METHODS } from '@/shared/constants';
import {
  User,
  UpdateProfilePayload,
  CheckUsernameResponseData,
  FollowListArgs,
  PublicProfile,
  UserSummary,
  UserSummaryPage,
} from '../model/types';
import { USER_LIST_CONFIG } from '../model/constants';
import { followListTag, publicProfileTag } from '../model/tags';

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

    getPublicProfile: builder.query<PublicProfile, string>({
      query: username => ({
        url: API_ENDPOINTS.USERS.PUBLIC_PROFILE(username),
        method: HTTP_METHODS.GET,
      }),
      transformResponse: (response: ApiSuccessResponse<{ user: PublicProfile }>) =>
        response.data.user,
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      providesTags: (_result, _error, username) => [publicProfileTag(username)],
    }),

    // Pages are fetched by cursor, newest follow first
    getFollowList: builder.infiniteQuery<UserSummaryPage, FollowListArgs, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextCursor,
      },
      query: ({ queryArg: { userId, type }, pageParam }) => ({
        url:
          type === FOLLOW_LIST_TYPES.FOLLOWERS
            ? API_ENDPOINTS.USERS.FOLLOWERS(userId)
            : API_ENDPOINTS.USERS.FOLLOWING(userId),
        method: HTTP_METHODS.GET,
        params: {
          limit: USER_LIST_CONFIG.PAGE_SIZE,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<UserSummaryPage>) => response.data,
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      providesTags: (_result, _error, { userId, type }) => [followListTag(type, userId)],
    }),

    searchUsers: builder.query<UserSummary[], string>({
      query: q => ({
        url: API_ENDPOINTS.USERS.SEARCH,
        method: HTTP_METHODS.GET,
        params: { q },
      }),
      transformResponse: (response: ApiSuccessResponse<{ users: UserSummary[] }>) =>
        response.data.users,
      extraOptions: {
        skipGlobalErrorToast: true,
      },
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
  useGetPublicProfileQuery,
  useGetFollowListInfiniteQuery,
  useSearchUsersQuery,
} = userApi;
