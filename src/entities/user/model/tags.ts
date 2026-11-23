import { FollowListType } from '@/shared/constants';

// Cache tags with ids, so one profile or list refetches without touching the rest
export const publicProfileTag = (username: string) =>
  ({ type: 'User', id: `PROFILE-${username.toLowerCase()}` }) as const;

export const followListTag = (type: FollowListType, userId: string) =>
  ({ type: 'User', id: `${type}-${userId}` }) as const;
