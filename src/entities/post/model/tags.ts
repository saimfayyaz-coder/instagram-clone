const USER_POSTS_TAG_PREFIX = 'USER-';

// Cache tag for one user's post list, so creating or deleting a post refetches only that list
export const userPostsTag = (userId: string) =>
  ({ type: 'Post', id: `${USER_POSTS_TAG_PREFIX}${userId}` }) as const;
