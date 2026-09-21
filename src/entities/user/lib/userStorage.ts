import { storage, STORAGE_KEYS } from '@/shared/lib/mmkv/appStorage';
import { User } from '../model/types';

export const userStorage = {
  saveUser(user: User): void {
    storage.setObject(STORAGE_KEYS.CURRENT_USER, user);
  },

  getUser(): User | null {
    return storage.getObject<User>(STORAGE_KEYS.CURRENT_USER) ?? null;
  },

  removeUser(): void {
    storage.delete(STORAGE_KEYS.CURRENT_USER);
  },
};
