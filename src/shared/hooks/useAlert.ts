import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { showAlert, hideAlert, AlertPayload } from '../lib/alert';

export const useAlert = () => {
  const dispatch = useAppDispatch();
  const alertState = useAppSelector(state => state.alert);

  const triggerAlert = useCallback(
    (payload: AlertPayload) => {
      dispatch(showAlert(payload));
    },
    [dispatch],
  );

  const dismissAlert = useCallback(() => {
    dispatch(hideAlert());
  }, [dispatch]);

  return {
    showAlert: triggerAlert,
    hideAlert: dismissAlert,
    alertState,
  };
};
