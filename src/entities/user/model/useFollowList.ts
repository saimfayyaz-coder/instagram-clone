import { useCallback, useMemo } from 'react';
import { FollowListType } from '@/shared/constants';
import { useGetFollowListInfiniteQuery } from '../api/userApi';
import { UserSummary } from './types';

const EMPTY_USERS: UserSummary[] = [];

// One user's followers or following as a flat list
export const useFollowList = (userId: string, type: FollowListType) => {
  const query = useGetFollowListInfiniteQuery({ userId, type });
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, refetch } = query;

  const users = useMemo(
    () => (data ? data.pages.flatMap(page => page.users) : EMPTY_USERS),
    [data],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  return {
    users,
    isLoading: query.isLoading,
    isError: query.isError && users.length === 0,
    isLoadingMore: isFetchingNextPage,
    loadMore,
    refetch,
  };
};
