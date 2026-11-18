import { fetchFeedPage } from '@/entities/post/api/fetchFeedPage';
import { createMockPosts } from '@/entities/post/api/mockPosts';
import { FEED_CONFIG } from '@/entities/post/model/constants';

const fetchPage = async (cursor?: number) => {
  const promise = fetchFeedPage(cursor);
  jest.advanceTimersByTime(FEED_CONFIG.MOCK_DELAY_MS);
  return promise;
};

describe('fetchFeedPage', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('returns the first page with a cursor to the next one', async () => {
    const page = await fetchPage();
    expect(page.posts).toHaveLength(FEED_CONFIG.PAGE_SIZE);
    expect(page.nextCursor).toBe(FEED_CONFIG.PAGE_SIZE);
  });

  it('walks through every post once and then stops', async () => {
    const total = createMockPosts().length;
    const ids: string[] = [];
    let cursor: number | null = 0;

    while (cursor !== null) {
      const page = await fetchPage(cursor);
      ids.push(...page.posts.map(post => post.id));
      cursor = page.nextCursor;
    }

    expect(ids).toHaveLength(total);
    expect(new Set(ids).size).toBe(total);
  });
});

describe('createMockPosts', () => {
  it('gives every post at least one image and unique image ids', () => {
    createMockPosts().forEach(post => {
      expect(post.images.length).toBeGreaterThan(0);
      expect(new Set(post.images.map(image => image.id)).size).toBe(post.images.length);
    });
  });

  it('includes posts with several images', () => {
    expect(createMockPosts().some(post => post.images.length > 1)).toBe(true);
  });
});
