import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PermissionsAndroid,
  AppState,
  AppStateStatus,
  Linking,
} from 'react-native';
import {
  isAndroid,
  ANDROID_VERSION,
  ANDROID_API_LEVELS,
} from '@/shared/constants';
import {
  MEDIA_PERMISSION_STATUS,
  MediaPermissionStatus,
} from '@/shared/types';

const ANDROID_VISUAL_SELECTED_PERMISSION =
  (PermissionsAndroid.PERMISSIONS as any).READ_MEDIA_VISUAL_USER_SELECTED ||
  'android.permission.READ_MEDIA_VISUAL_USER_SELECTED';

const APP_STATE_ACTIVE = 'active';

export const useMediaPermission = () => {
  const [permissionStatus, setPermissionStatus] =
    useState<MediaPermissionStatus>(MEDIA_PERMISSION_STATUS.UNDETERMINED);
  const appState = useRef(AppState.currentState);

  const checkAndroidPermission = useCallback(async (): Promise<MediaPermissionStatus> => {
    if (!isAndroid) {
      return MEDIA_PERMISSION_STATUS.GRANTED;
    }

    try {
      if (ANDROID_VERSION >= ANDROID_API_LEVELS.TIRAMISU) {
        const hasImagesPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );

        if (hasImagesPermission) {
          return MEDIA_PERMISSION_STATUS.GRANTED;
        }

        // On Android 14+ (API 34+), check for limited/selected access
        if (ANDROID_VERSION >= ANDROID_API_LEVELS.UPSIDE_DOWN_CAKE) {
          const hasVisualSelected = await PermissionsAndroid.check(
            ANDROID_VISUAL_SELECTED_PERMISSION,
          );
          if (hasVisualSelected) {
            return MEDIA_PERMISSION_STATUS.LIMITED;
          }
        }

        return MEDIA_PERMISSION_STATUS.DENIED;
      }

      // Android 12 and below
      const hasStoragePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      return hasStoragePermission
        ? MEDIA_PERMISSION_STATUS.GRANTED
        : MEDIA_PERMISSION_STATUS.DENIED;
    } catch {
      return MEDIA_PERMISSION_STATUS.DENIED;
    }
  }, []);

  const checkPermission = useCallback(async () => {
    if (isAndroid) {
      const status = await checkAndroidPermission();
      setPermissionStatus(status);
      return status;
    }

    setPermissionStatus(MEDIA_PERMISSION_STATUS.GRANTED);
    return MEDIA_PERMISSION_STATUS.GRANTED;
  }, [checkAndroidPermission]);

  const requestPermission = useCallback(async (): Promise<MediaPermissionStatus> => {
    if (!isAndroid) {
      return MEDIA_PERMISSION_STATUS.GRANTED;
    }

    try {
      if (ANDROID_VERSION >= ANDROID_API_LEVELS.UPSIDE_DOWN_CAKE) {
        const statuses = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ANDROID_VISUAL_SELECTED_PERMISSION,
        ]);

        const imagesGranted =
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED;

        const partialGranted =
          (statuses as Record<string, string>)[
            ANDROID_VISUAL_SELECTED_PERMISSION
          ] === PermissionsAndroid.RESULTS.GRANTED;

        if (imagesGranted) {
          setPermissionStatus(MEDIA_PERMISSION_STATUS.GRANTED);
          return MEDIA_PERMISSION_STATUS.GRANTED;
        }
        if (partialGranted) {
          setPermissionStatus(MEDIA_PERMISSION_STATUS.LIMITED);
          return MEDIA_PERMISSION_STATUS.LIMITED;
        }

        const imagesNeverAsk =
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;

        const nextStatus = imagesNeverAsk
          ? MEDIA_PERMISSION_STATUS.BLOCKED
          : MEDIA_PERMISSION_STATUS.DENIED;

        setPermissionStatus(nextStatus);
        if (nextStatus === MEDIA_PERMISSION_STATUS.BLOCKED) {
          Linking.openSettings();
        }
        return nextStatus;
      }

      if (ANDROID_VERSION === ANDROID_API_LEVELS.TIRAMISU) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionStatus(MEDIA_PERMISSION_STATUS.GRANTED);
          return MEDIA_PERMISSION_STATUS.GRANTED;
        }

        const nextStatus =
          result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
            ? MEDIA_PERMISSION_STATUS.BLOCKED
            : MEDIA_PERMISSION_STATUS.DENIED;

        setPermissionStatus(nextStatus);
        if (nextStatus === MEDIA_PERMISSION_STATUS.BLOCKED) {
          Linking.openSettings();
        }
        return nextStatus;
      }

      // Android 12 and below
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionStatus(MEDIA_PERMISSION_STATUS.GRANTED);
        return MEDIA_PERMISSION_STATUS.GRANTED;
      }

      const nextStatus =
        result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
          ? MEDIA_PERMISSION_STATUS.BLOCKED
          : MEDIA_PERMISSION_STATUS.DENIED;

      setPermissionStatus(nextStatus);
      if (nextStatus === MEDIA_PERMISSION_STATUS.BLOCKED) {
        Linking.openSettings();
      }
      return nextStatus;
    } catch {
      setPermissionStatus(MEDIA_PERMISSION_STATUS.DENIED);
      return MEDIA_PERMISSION_STATUS.DENIED;
    }
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  // Listen to AppState changes (e.g., returning from Settings)
  useEffect(() => {
    checkPermission();

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current?.match(/inactive|background/) &&
          nextAppState === APP_STATE_ACTIVE
        ) {
          checkPermission();
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [checkPermission]);

  return {
    permissionStatus,
    checkPermission,
    requestPermission,
    openSettings,
    isGranted:
      permissionStatus === MEDIA_PERMISSION_STATUS.GRANTED ||
      permissionStatus === MEDIA_PERMISSION_STATUS.LIMITED,
  };
};
