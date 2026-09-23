export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  isVerified?: boolean;
}

export interface UserState {
  currentUser: User | null;
}
