import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { showToast, hideToast, ToastPayload } from '../lib/toast/toastSlice';

export const useToast = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(state => state.toast);

  const triggerToast = useCallback(
    (messageOrPayload: string | ToastPayload) => {
      if (typeof messageOrPayload === 'string') {
        dispatch(showToast({ message: messageOrPayload }));
      } else {
        dispatch(showToast(messageOrPayload));
      }
    },
    [dispatch],
  );

  const dismissToast = useCallback(() => {
    dispatch(hideToast());
  }, [dispatch]);

  return {
    showToast: triggerToast,
    hideToast: dismissToast,
    toast,
  };
};
