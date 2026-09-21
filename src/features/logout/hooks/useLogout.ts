import { useState } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import {
  clearSession,
  authStorage,
  useLogoutMutation,
} from '@/entities/session';
import { setUser } from '@/entities/user';
import { baseApi } from '@/shared/api';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = await authStorage.getRefreshToken();
      if (refreshToken) {
        // Best-effort: inform server to revoke the refresh token in MongoDB
        await logoutMutation({ refreshToken }).unwrap().catch(() => { });
      }
    } finally {
      await authStorage.removeRefreshToken();
      dispatch(clearSession());
      dispatch(setUser(null));
      dispatch(baseApi.util.resetApiState());
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoading: isLoggingOut,
  };
};
