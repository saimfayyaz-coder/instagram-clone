import { createMMKV } from 'react-native-mmkv';

export const appStorage = createMMKV({
  id: 'instagram-app-storage',
});

export const STORAGE_KEYS = {
  THEME_MODE: 'app:themeMode',
  LANGUAGE: 'app:language',
} as const;

export const storage = {
  setString: (key: string, value: string) => appStorage.set(key, value),
  getString: (key: string) => appStorage.getString(key),
  setObject: <T>(key: string, value: T) => {
    try {
      appStorage.set(key, JSON.stringify(value));
    } catch (error) {
      console.warn(
        `[storage] Failed to stringify object for key: ${key}`,
        error,
      );
    }
  },
  getObject: <T>(key: string): T | undefined => {
    const json = appStorage.getString(key);
    if (!json) return undefined;
    try {
      return JSON.parse(json) as T;
    } catch (error) {
      console.warn(`[storage] Failed to parse object for key: ${key}`, error);
      return undefined;
    }
  },
  setBoolean: (key: string, value: boolean) => appStorage.set(key, value),
  getBoolean: (key: string) => appStorage.getBoolean(key),
  setNumber: (key: string, value: number) => appStorage.set(key, value),
  getNumber: (key: string) => appStorage.getNumber(key),
  delete: (key: string) => appStorage.remove(key),
  clearAll: () => appStorage.clearAll(),
};
