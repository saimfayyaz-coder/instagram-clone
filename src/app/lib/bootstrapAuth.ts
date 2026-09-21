import { AppDispatch } from '../store/store';
import {
  setAccessToken,
  finishInitializing,
  clearSession,
  authStorage,
  sessionApi,
} from '@/entities/session';
import { setUser, userApi } from '@/entities/user';

export const bootstrapAuth = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const refreshToken = await authStorage.getRefreshToken();

    if (!refreshToken) {
      return;
    }

    const refreshResponse = await dispatch(
      sessionApi.endpoints.refreshToken.initiate({ refreshToken }),
    ).unwrap();

    const accessToken = refreshResponse.data.accessToken;
    dispatch(setAccessToken(accessToken));

    try {
      const userResponse = await dispatch(
        userApi.endpoints.getCurrentUser.initiate(),
      ).unwrap();

      if (userResponse.data?.user) {
        dispatch(setUser(userResponse.data.user));
      }
    } catch {
      // User profile will remain as hydrated from local MMKV userStorage
    }
  } catch (error: any) {
    // Only clear session if server explicitly rejected the token as invalid or expired (401)
    if (error?.status === 401) {
      await authStorage.removeRefreshToken();
      dispatch(clearSession());
      dispatch(setUser(null));
    }
  } finally {
    dispatch(finishInitializing());
  }
};
