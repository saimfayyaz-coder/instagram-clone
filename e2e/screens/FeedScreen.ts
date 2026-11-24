import { by, element, waitFor } from 'detox';
import { TEST_IDS } from '@/shared/constants/testIds';

export const FeedScreen = {
  list: () => element(by.id(TEST_IDS.FEED.LIST)),
  firstPost: () => element(by.id(TEST_IDS.FEED.POST)).atIndex(0),
  firstLikeButton: () => element(by.id(TEST_IDS.FEED.LIKE_BUTTON)).atIndex(0),

  async waitUntilLoaded() {
    // The feed loads from the API; the test user is created with one post
    await waitFor(this.firstLikeButton()).toBeVisible().withTimeout(15000);
  },

  // The like button's accessibility label is TEST_DATA.LIKE_LABELS.LIKE or .UNLIKE, depending on state
  async firstLikeLabel(): Promise<string> {
    const attributes = await this.firstLikeButton().getAttributes();
    if ('elements' in attributes) {
      throw new Error('Expected a single like button');
    }
    return attributes.label ?? '';
  },

  async toggleFirstLike() {
    await this.firstLikeButton().tap();
  },
};
