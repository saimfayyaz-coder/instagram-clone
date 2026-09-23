import { AppDispatch } from '../store/store';
import {
  finishInitializing,
  clearSession,
  authStorage,
  sessionApi,
} from '@/entities/session';
import { userApi } from '@/entities/user';

export const bootstrapAuth = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const refreshToken = await authStorage.getRefreshToken();

    if (!refreshToken) {
      return;
    }

    await dispatch(
      sessionApi.endpoints.refreshToken.initiate({ refreshToken }),
    ).unwrap();

    try {
      await dispatch(
        userApi.endpoints.getCurrentUser.initiate(),
      ).unwrap();
    } catch {
      // User profile will remain as hydrated by redux-persist
    }
  } catch (error: any) {
    // Only clear session if server explicitly rejected the token as invalid or expired (401)
    if (error?.status === 401) {
      dispatch(clearSession());
    }
  } finally {
    dispatch(finishInitializing());
  }
};
