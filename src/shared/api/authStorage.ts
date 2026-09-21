import { secureStorage } from '@/shared/lib/secureStorage';

const REFRESH_TOKEN_KEY = 'auth:refreshToken';

export const authStorage = {
  async saveRefreshToken(refreshToken: string): Promise<void> {
    await secureStorage.set(REFRESH_TOKEN_KEY, refreshToken);
  },

  async getRefreshToken(): Promise<string | null> {
    return await secureStorage.get(REFRESH_TOKEN_KEY);
  },

  async removeRefreshToken(): Promise<void> {
    await secureStorage.remove(REFRESH_TOKEN_KEY);
  },
};
