import { PERMISSION_STATES, PermissionKind, PermissionState } from '@/shared/constants';
import { nativePermissions } from './nativePermissions';

export const isPermissionUsable = (state: PermissionState): boolean =>
  state === PERMISSION_STATES.GRANTED || state === PERMISSION_STATES.LIMITED;

export const checkPermission = async (kind: PermissionKind): Promise<PermissionState> => {
  try {
    return await nativePermissions.check(kind);
  } catch {
    return PERMISSION_STATES.DENIED;
  }
};

export const requestPermission = async (kind: PermissionKind): Promise<PermissionState> => {
  try {
    return await nativePermissions.request(kind);
  } catch {
    return PERMISSION_STATES.DENIED;
  }
};

// Asks only when needed; returns the final state
export const ensurePermission = async (kind: PermissionKind): Promise<PermissionState> => {
  const current = await checkPermission(kind);
  return current === PERMISSION_STATES.DENIED ? requestPermission(kind) : current;
};

export const openPermissionSettings = (): Promise<void> => nativePermissions.openSettings();
