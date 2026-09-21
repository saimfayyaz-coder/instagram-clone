import { User, UserState } from './types';

export const selectCurrentUser = (state: { user: UserState }): User | null =>
  state.user.currentUser;
