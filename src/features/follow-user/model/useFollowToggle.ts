import { useCallback, useRef } from 'react';
import { adjustFollowingCount, selectCurrentUser } from '@/entities/user';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { showToast } from '@/shared/lib/toast';
import { parseApiError } from '@/shared/lib/errors';
import { TOAST_TYPES } from '@/shared/constants';
import { useSetFollowMutation } from '../api/followApi';
import { FollowTarget } from '../model/types';

// Follows or unfollows at once; the signed-in user's following count moves with it
export const useFollowToggle = () => {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(selectCurrentUser)?.id;
  const [setFollow] = useSetFollowMutation();
  // A second tap while a request is running would send the opposite request out of order
  const pendingIds = useRef(new Set<string>());

  const toggleFollow = useCallback(
    async (target: FollowTarget) => {
      if (!currentUserId || target.id === currentUserId || pendingIds.current.has(target.id)) {
        return;
      }

      const follow = !target.isFollowing;
      const countStep = follow ? 1 : -1;
      pendingIds.current.add(target.id);
      dispatch(adjustFollowingCount(countStep));

      try {
        await setFollow({ userId: target.id, viewerId: currentUserId, follow }).unwrap();
      } catch (error) {
        dispatch(adjustFollowingCount(-countStep));
        showToast({ message: parseApiError(error).message, type: TOAST_TYPES.ERROR });
      } finally {
        pendingIds.current.delete(target.id);
      }
    },
    [currentUserId, dispatch, setFollow],
  );

  return { toggleFollow, currentUserId };
};
