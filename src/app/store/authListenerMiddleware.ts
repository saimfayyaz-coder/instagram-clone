import { createListenerMiddleware } from '@reduxjs/toolkit';
import { clearSession, setAccessToken, authStorage } from '@/entities/session';
import { setUser } from '@/entities/user';

export const authListenerMiddleware = createListenerMiddleware();

// 1. Centralized Session Cleanup (Logout or 401 token expiry)
authListenerMiddleware.startListening({
  predicate: (action) =>
    clearSession.match(action) || action.type === 'session/clearSession',
  effect: async () => {
    await authStorage.removeRefreshToken();
  },
});

// 2. Centralized Auth Success (Save RefreshToken to Keychain & Dispatch Tokens/User)
authListenerMiddleware.startListening({
  predicate: (action: any) =>
    Boolean(
      action?.type?.endsWith('/fulfilled') &&
      action?.payload?.data?.accessToken,
    ),
  effect: async (action: any, listenerApi) => {
    const { accessToken, refreshToken, user } = action.payload.data;
    if (refreshToken) {
      await authStorage.saveRefreshToken(refreshToken);
    }
    if (accessToken) {
      listenerApi.dispatch(setAccessToken(accessToken));
    }
    if (user) {
      listenerApi.dispatch(setUser(user));
    }
  },
});
