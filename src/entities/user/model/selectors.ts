import { User, UserState } from './types';

export const selectCurrentUser = (state: { user: UserState }): User | null =>
  state.user.currentUser;

export const selectCurrentUserAvatar = (state: { user: UserState }): string | null => {
  const user = state.user.currentUser;
  return user?.avatar?.url || user?.avatarUrl || null;
};

export const selectIsAvatarUpdating = (state: { user: UserState }): boolean =>
  Boolean(state.user.isAvatarUpdating);

export const getUserDisplayName = (user?: User | null): string =>
  user?.name || user?.fullName || '';

export const selectCurrentUserDisplayName = (state: { user: UserState }): string =>
  getUserDisplayName(state.user.currentUser);
