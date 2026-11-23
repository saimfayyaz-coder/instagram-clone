import type { FollowListType } from '@/shared/constants';
import { GenderType, GenderOption } from './constants';

export type { GenderType, GenderOption };

export interface UserAvatarData {
  url: string;
  publicId?: string;
}

export interface UserLink {
  _id: string;
  url: string;
  title?: string;
}

export interface User {
  id: string;
  username: string;
  // Only the signed-in user's own profile has an email
  email?: string;
  name?: string;
  fullName?: string;
  avatar?: UserAvatarData | null;
  avatarUrl?: string | null;
  bio?: string;
  website?: string;
  links?: UserLink[];
  gender?: GenderType;
  isVerified?: boolean;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

// Another user's profile, as the signed-in user sees it
export interface PublicProfile extends User {
  isFollowing: boolean;
}

// A row in followers, following and search lists
export interface UserSummary {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowing: boolean;
}

export interface UserSummaryPage {
  users: UserSummary[];
  // Null when there are no more users
  nextCursor: string | null;
}

export interface FollowListArgs {
  userId: string;
  type: FollowListType;
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  bio?: string;
  website?: string;
  gender?: GenderType;
}

export interface CheckUsernameResponseData {
  username: string;
  isAvailable: boolean;
}

export interface UserState {
  currentUser: User | null;
  isAvatarUpdating?: boolean;
  // Local file shown in place of the avatar while it uploads
  pendingAvatarUri?: string | null;
}
