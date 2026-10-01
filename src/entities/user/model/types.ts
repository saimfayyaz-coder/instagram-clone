export type GenderType = 'male' | 'female' | 'custom' | 'prefer_not_to_say';

export interface UserAvatar {
  url: string;
  publicId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  fullName?: string;
  avatar?: UserAvatar | null;
  avatarUrl?: string | null;
  bio?: string;
  website?: string;
  gender?: GenderType;
  isVerified?: boolean;
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
}
