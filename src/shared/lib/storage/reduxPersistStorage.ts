import type { Storage } from 'redux-persist';
import { storage } from '../mmkv/appStorage';

export const reduxPersistStorage: Storage = {
  setItem: (key: string, value: string): Promise<boolean> => {
    storage.setString(key, value);
    return Promise.resolve(true);
  },

  getItem: (key: string): Promise<string | null> => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },

  removeItem: (key: string): Promise<void> => {
    storage.delete(key);
    return Promise.resolve();
  },
};
