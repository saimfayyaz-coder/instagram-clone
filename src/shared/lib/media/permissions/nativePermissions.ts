import { Linking, PermissionsAndroid, Permission } from 'react-native';
import {
  CameraRollAuthorizationStatus,
  iosReadGalleryPermission,
  iosRequestReadWriteGalleryPermission,
} from '@react-native-camera-roll/camera-roll';
import {
  ANDROID_API_LEVELS,
  ANDROID_VERSION,
  isAndroid,
  PERMISSION_KINDS,
  PERMISSION_STATES,
  PermissionKind,
  PermissionState,
} from '@/shared/constants';

// Not in RN's typed list yet; Android 14+ partial photo access
const READ_MEDIA_VISUAL_USER_SELECTED =
  'android.permission.READ_MEDIA_VISUAL_USER_SELECTED' as Permission;

const IOS_READ_WRITE = 'readWrite';

const IOS_STATUS_MAP: Record<CameraRollAuthorizationStatus, PermissionState> = {
  granted: PERMISSION_STATES.GRANTED,
  limited: PERMISSION_STATES.LIMITED,
  'not-determined': PERMISSION_STATES.DENIED,
  // iOS never shows the dialog again after a denial
  denied: PERMISSION_STATES.BLOCKED,
  blocked: PERMISSION_STATES.BLOCKED,
  unavailable: PERMISSION_STATES.BLOCKED,
};

const fromAndroidResult = (result: string): PermissionState => {
  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    return PERMISSION_STATES.GRANTED;
  }
  return result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ? PERMISSION_STATES.BLOCKED
    : PERMISSION_STATES.DENIED;
};

const androidPhotoPermission = (): Permission =>
  ANDROID_VERSION >= ANDROID_API_LEVELS.TIRAMISU
    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

const hasPartialPhotoAccess = ANDROID_VERSION >= ANDROID_API_LEVELS.UPSIDE_DOWN_CAKE;

const checkAndroid = async (kind: PermissionKind): Promise<PermissionState> => {
  if (kind === PERMISSION_KINDS.CAMERA) {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    return granted ? PERMISSION_STATES.GRANTED : PERMISSION_STATES.DENIED;
  }

  if (await PermissionsAndroid.check(androidPhotoPermission())) {
    return PERMISSION_STATES.GRANTED;
  }
  if (hasPartialPhotoAccess && (await PermissionsAndroid.check(READ_MEDIA_VISUAL_USER_SELECTED))) {
    return PERMISSION_STATES.LIMITED;
  }
  // Android can't tell "never asked" from "blocked" until we ask
  return PERMISSION_STATES.DENIED;
};

const requestAndroid = async (kind: PermissionKind): Promise<PermissionState> => {
  if (kind === PERMISSION_KINDS.CAMERA) {
    return fromAndroidResult(
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA),
    );
  }

  if (!hasPartialPhotoAccess) {
    return fromAndroidResult(await PermissionsAndroid.request(androidPhotoPermission()));
  }

  const results = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    READ_MEDIA_VISUAL_USER_SELECTED,
  ]);
  const full = fromAndroidResult(results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]);
  if (full === PERMISSION_STATES.GRANTED) {
    return full;
  }
  if (results[READ_MEDIA_VISUAL_USER_SELECTED] === PermissionsAndroid.RESULTS.GRANTED) {
    return PERMISSION_STATES.LIMITED;
  }
  return full;
};

// iOS camera access is asked by the camera itself when it opens
const checkIos = async (kind: PermissionKind): Promise<PermissionState> =>
  kind === PERMISSION_KINDS.CAMERA
    ? PERMISSION_STATES.GRANTED
    : IOS_STATUS_MAP[await iosReadGalleryPermission(IOS_READ_WRITE)];

const requestIos = async (kind: PermissionKind): Promise<PermissionState> =>
  kind === PERMISSION_KINDS.CAMERA
    ? PERMISSION_STATES.GRANTED
    : IOS_STATUS_MAP[await iosRequestReadWriteGalleryPermission()];

export const nativePermissions = {
  check: (kind: PermissionKind): Promise<PermissionState> =>
    isAndroid ? checkAndroid(kind) : checkIos(kind),
  request: (kind: PermissionKind): Promise<PermissionState> =>
    isAndroid ? requestAndroid(kind) : requestIos(kind),
  openSettings: (): Promise<void> => Linking.openSettings(),
};
