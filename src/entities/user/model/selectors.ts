import { User, UserState } from './types';

export const selectCurrentUser = (state: { user: UserState }): User | null =>
  state.user.currentUser;

export const selectCurrentUserAvatar = (state: { user: UserState }): string | null => {
  const user = state.user.currentUser;
  return user?.avatar?.url || user?.avatarUrl || null;
};
