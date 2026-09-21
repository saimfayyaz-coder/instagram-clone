export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UserState {
  currentUser: User | null;
}
