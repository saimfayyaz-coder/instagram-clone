import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, FOLLOW_LIST_TYPES, HTTP_METHODS } from '@/shared/constants';
import { followListTag, userApi } from '@/entities/user';
import { FEED_TAG } from '@/entities/post';
import { FollowState, SetFollowArgs } from '../model/types';

export const followApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    setFollow: builder.mutation<ApiSuccessResponse<FollowState>, SetFollowArgs>({
      query: ({ userId, follow }) => ({
        url: API_ENDPOINTS.USERS.FOLLOW(userId),
        method: follow ? HTTP_METHODS.POST : HTTP_METHODS.DELETE,
      }),
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      // Flips the button everywhere this user is shown; undone if the server refuses
      async onQueryStarted({ userId, follow }, { dispatch, getState, queryFulfilled }) {
        const state = getState();
        const countStep = follow ? 1 : -1;

        const profilePatches = userApi.util
          .selectCachedArgsForQuery(state, 'getPublicProfile')
          .map(username =>
            dispatch(
              userApi.util.updateQueryData('getPublicProfile', username, draft => {
                if (draft.id !== userId || draft.isFollowing === follow) return;
                draft.isFollowing = follow;
                draft.followersCount = Math.max(0, (draft.followersCount ?? 0) + countStep);
              }),
            ),
          );

        const listPatches = userApi.util
          .selectCachedArgsForQuery(state, 'getFollowList')
          .map(args =>
            dispatch(
              userApi.util.updateQueryData('getFollowList', args, draft => {
                draft.pages.forEach(page =>
                  page.users.forEach(user => {
                    if (user.id === userId) user.isFollowing = follow;
                  }),
                );
              }),
            ),
          );

        const searchPatches = userApi.util
          .selectCachedArgsForQuery(state, 'searchUsers')
          .map(query =>
            dispatch(
              userApi.util.updateQueryData('searchUsers', query, draft => {
                draft.forEach(user => {
                  if (user.id === userId) user.isFollowing = follow;
                });
              }),
            ),
          );

        try {
          const { data } = await queryFulfilled;
          // The server's count also includes other people's follows since the profile loaded
          userApi.util.selectCachedArgsForQuery(getState(), 'getPublicProfile').forEach(username =>
            dispatch(
              userApi.util.updateQueryData('getPublicProfile', username, draft => {
                if (draft.id === userId) draft.followersCount = data.data.followersCount;
              }),
            ),
          );
        } catch {
          [...profilePatches, ...listPatches, ...searchPatches].forEach(patch => patch.undo());
        }
      },
      invalidatesTags: (_result, error, { userId, viewerId }) =>
        error
          ? []
          : [
              followListTag(FOLLOW_LIST_TYPES.FOLLOWERS, userId),
              followListTag(FOLLOW_LIST_TYPES.FOLLOWING, viewerId),
              FEED_TAG,
            ],
    }),
  }),
});

export const { useSetFollowMutation } = followApi;
