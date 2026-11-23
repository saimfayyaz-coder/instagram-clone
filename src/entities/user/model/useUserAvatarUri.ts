import { useAppSelector } from '@/app/store';
import { User } from './types';
import { selectCurrentUser, selectPendingAvatarUri } from './selectors';

export const isSameUser = (a?: User | null, b?: User | null): boolean => {
  if (!a || !b) {
    return false;
  }
  const aId = (a as any)._id;
  return Boolean(
    (a.id && a.id === b.id) || (aId && (aId === (b as any)._id || aId === b.id)),
  );
};

// The photo to show for a user: the one being uploaded if it's the current user, else the saved one
export const useUserAvatarUri = (user?: User | null, uri?: string | null) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const pendingAvatarUri = useAppSelector(selectPendingAvatarUri);

  const isCurrentUser = isSameUser(user, currentUser);
  const savedUri = user ? user.avatar?.url || user.avatarUrl || null : uri ?? null;

  return {
    uri: (isCurrentUser && pendingAvatarUri) || savedUri,
    isCurrentUser,
  };
};
