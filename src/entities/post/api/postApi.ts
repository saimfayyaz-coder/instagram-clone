import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, HTTP_METHODS } from '@/shared/constants';
import { ApiPost, PostsPage } from '../model/types';
import { FEED_CONFIG, USER_POSTS_CONFIG } from '../model/constants';
import { FEED_TAG, userPostsTag } from '../model/tags';
import { mapApiPost } from '../lib/mapApiPost';

interface ApiPostsPage {
  posts: ApiPost[];
  nextCursor: string | null;
}

export interface DeletePostArgs {
  postId: string;
  userId: string;
}

export const postApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Arg is the user id; pages are fetched by cursor, newest first
    getUserPosts: builder.infiniteQuery<PostsPage, string, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextCursor,
      },
      query: ({ queryArg, pageParam }) => ({
        url: API_ENDPOINTS.USERS.POSTS(queryArg),
        method: HTTP_METHODS.GET,
        params: {
          limit: USER_POSTS_CONFIG.PAGE_SIZE,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<ApiPostsPage>) => ({
        posts: response.data.posts.map(mapApiPost),
        nextCursor: response.data.nextCursor,
      }),
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      providesTags: (_result, _error, userId) => [userPostsTag(userId)],
    }),

    // Posts from followed users plus the user's own, newest first
    getFeed: builder.infiniteQuery<PostsPage, void, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: lastPage => lastPage.nextCursor,
      },
      query: ({ pageParam }) => ({
        url: API_ENDPOINTS.POSTS.FEED,
        method: HTTP_METHODS.GET,
        params: {
          limit: FEED_CONFIG.PAGE_SIZE,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      }),
      transformResponse: (response: ApiSuccessResponse<ApiPostsPage>) => ({
        posts: response.data.posts.map(mapApiPost),
        nextCursor: response.data.nextCursor,
      }),
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      providesTags: [FEED_TAG],
    }),

    deletePost: builder.mutation<ApiSuccessResponse<{ postId: string }>, DeletePostArgs>({
      query: ({ postId }) => ({
        url: API_ENDPOINTS.POSTS.BY_ID(postId),
        method: HTTP_METHODS.DELETE,
      }),
      extraOptions: {
        skipGlobalErrorToast: true,
      },
      // Removes the post right away; puts it back if the server refuses
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        const removePost = (draft: { pages: PostsPage[] }) => {
          draft.pages.forEach(page => {
            page.posts = page.posts.filter(post => post.id !== postId);
          });
        };
        const patches = [
          dispatch(postApi.util.updateQueryData('getUserPosts', userId, removePost)),
          dispatch(postApi.util.updateQueryData('getFeed', undefined, removePost)),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach(patch => patch.undo());
        }
      },
    }),
  }),
});

export const { useGetUserPostsInfiniteQuery, useGetFeedInfiniteQuery, useDeletePostMutation } =
  postApi;
