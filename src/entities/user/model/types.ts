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
  email: string;
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
}
