import { useCallback, useEffect, useRef, useState } from 'react';
import { Post, fetchFeedPage } from '@/entities/post';

export const useFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // A refresh makes a page that is still loading outdated; only the latest request may write
  const latestRequest = useRef(0);

  const loadFirstPage = useCallback(async () => {
    const request = ++latestRequest.current;
    const page = await fetchFeedPage();
    if (request === latestRequest.current) {
      setPosts(page.posts);
      setNextCursor(page.nextCursor);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadFirstPage().finally(() => setIsLoading(false));
  }, [loadFirstPage]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadFirstPage();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || isRefreshing || nextCursor === null) {
      return;
    }
    const request = ++latestRequest.current;
    setIsLoadingMore(true);
    try {
      const page = await fetchFeedPage(nextCursor);
      if (request === latestRequest.current) {
        setPosts(current => [...current, ...page.posts]);
        setNextCursor(page.nextCursor);
      }
    } finally {
      if (request === latestRequest.current) {
        setIsLoadingMore(false);
      }
    }
  }, [isLoading, isLoadingMore, isRefreshing, nextCursor]);

  const toggleLike = useCallback((postId: string) => {
    setPosts(current =>
      current.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likeCount: post.likeCount + (post.isLiked ? -1 : 1) }
          : post,
      ),
    );
  }, []);

  const toggleSave = useCallback((postId: string) => {
    setPosts(current =>
      current.map(post => (post.id === postId ? { ...post, isSaved: !post.isSaved } : post)),
    );
  }, []);

  return {
    posts,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore: nextCursor !== null,
    refresh,
    loadMore,
    toggleLike,
    toggleSave,
  };
};
