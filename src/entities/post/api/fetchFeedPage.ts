import { FeedPage } from '../model/types';
import { FEED_CONFIG } from '../model/constants';
import { createMockPosts } from './mockPosts';

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Stands in for the feed API until the backend has posts; cursor is the index of the next post
export const fetchFeedPage = async (
  cursor: number = 0,
  limit: number = FEED_CONFIG.PAGE_SIZE,
): Promise<FeedPage> => {
  await wait(FEED_CONFIG.MOCK_DELAY_MS);

  const allPosts = createMockPosts();
  const posts = allPosts.slice(cursor, cursor + limit);
  const nextIndex = cursor + posts.length;

  return {
    posts,
    nextCursor: nextIndex < allPosts.length ? nextIndex : null,
  };
};
