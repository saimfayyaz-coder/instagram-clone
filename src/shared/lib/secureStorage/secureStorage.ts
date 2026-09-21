import * as Keychain from 'react-native-keychain';

export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(key, value, { service: key });
    } catch (error) {
      console.warn(`[secureStorage] Failed to set key "${key}":`, error);
    }
  },

  async get(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      return credentials ? credentials.password : null;
    } catch (error) {
      console.warn(`[secureStorage] Failed to get key "${key}":`, error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      console.warn(`[secureStorage] Failed to remove key "${key}":`, error);
    }
  },
};
