import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { PERMISSION_STATES, PermissionKind, PermissionState } from '@/shared/constants';
import {
  checkPermission,
  isPermissionUsable,
  openPermissionSettings,
  requestPermission,
} from '@/shared/lib/media';

const APP_STATE_ACTIVE = 'active';

interface UsePermissionOptions {
  // Show the system dialog right away the first time, like Instagram does
  requestOnMount?: boolean;
}

export const usePermission = (kind: PermissionKind, options: UsePermissionOptions = {}) => {
  const { requestOnMount = false } = options;
  const [status, setStatus] = useState<PermissionState>(PERMISSION_STATES.CHECKING);
  const hasAutoRequested = useRef(false);

  const refresh = useCallback(async () => {
    const next = await checkPermission(kind);
    setStatus(next);
    return next;
  }, [kind]);

  const request = useCallback(async () => {
    const next = await requestPermission(kind);
    setStatus(next);
    return next;
  }, [kind]);

  useEffect(() => {
    refresh().then(initial => {
      if (requestOnMount && initial === PERMISSION_STATES.DENIED && !hasAutoRequested.current) {
        hasAutoRequested.current = true;
        request();
      }
    });

    // The user may have changed it in Settings
    const subscription = AppState.addEventListener('change', state => {
      if (state === APP_STATE_ACTIVE) {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh, request, requestOnMount]);

  return {
    status,
    isGranted: isPermissionUsable(status),
    isChecking: status === PERMISSION_STATES.CHECKING,
    isBlocked: status === PERMISSION_STATES.BLOCKED,
    request,
    refresh,
    openSettings: openPermissionSettings,
  };
};
