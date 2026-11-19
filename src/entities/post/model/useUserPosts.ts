import { useCallback, useMemo } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetUserPostsInfiniteQuery } from '../api/postApi';
import { isServerId } from '../lib/isServerId';
import { Post } from './types';

const EMPTY_POSTS: Post[] = [];

// One user's posts as a flat list; shared by the profile grid and the posts feed
export const useUserPosts = (userId?: string | null) => {
  const canLoad = isServerId(userId);
  const query = useGetUserPostsInfiniteQuery(canLoad ? userId : skipToken);
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, refetch } = query;

  const posts = useMemo(
    () => (data ? data.pages.flatMap(page => page.posts) : EMPTY_POSTS),
    [data],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  return {
    posts,
    isLoading: canLoad && query.isLoading,
    isError: query.isError && posts.length === 0,
    isLoadingMore: isFetchingNextPage,
    hasMore: Boolean(hasNextPage),
    loadMore,
    refetch: canLoad ? refetch : undefined,
  };
};
