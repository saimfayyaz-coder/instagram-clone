import { useCallback, useMemo, useState } from 'react';
import { Post, useGetFeedInfiniteQuery, useLocalPostToggles } from '@/entities/post';

const EMPTY_POSTS: Post[] = [];

// The home feed as a flat list; likes and saves stay on this screen until they have an API
export const useFeed = () => {
  const query = useGetFeedInfiniteQuery();
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, refetch } = query;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const feedPosts = useMemo(
    () => (data ? data.pages.flatMap(page => page.posts) : EMPTY_POSTS),
    [data],
  );
  const { posts, toggleLike, toggleSave } = useLocalPostToggles(feedPosts);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  return {
    posts,
    isLoading: query.isLoading,
    isError: query.isError && posts.length === 0,
    isLoadingMore: isFetchingNextPage,
    isRefreshing,
    hasMore: Boolean(hasNextPage),
    refresh,
    loadMore,
    toggleLike,
    toggleSave,
  };
};
