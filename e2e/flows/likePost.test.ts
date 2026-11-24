import { expect } from 'detox';
import { launchLoggedIn } from '../support/fixtures';
import { TEST_DATA } from '../support/testData';
import { FeedScreen } from '../screens/FeedScreen';

const { LIKE, UNLIKE } = TEST_DATA.LIKE_LABELS;

describe('Feed: like a post', () => {
  beforeAll(async () => {
    // The feed shows only own posts and followed users' posts, so the user gets one post
    await launchLoggedIn({ withPost: true });
    await FeedScreen.waitUntilLoaded();
  });

  it('toggles the like on the first post and back', async () => {
    // Likes are local-only for now, so compare against the starting state
    const before = await FeedScreen.firstLikeLabel();
    const toggled = before === LIKE ? UNLIKE : LIKE;

    await FeedScreen.toggleFirstLike();
    await expect(FeedScreen.firstLikeButton()).toHaveLabel(toggled);

    await FeedScreen.toggleFirstLike();
    await expect(FeedScreen.firstLikeButton()).toHaveLabel(before);
  });
});
