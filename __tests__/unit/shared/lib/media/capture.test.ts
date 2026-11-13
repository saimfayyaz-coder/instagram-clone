import { MEDIA_ERROR_CODES, PERMISSION_STATES } from '@/shared/constants';

jest.mock('@/shared/lib/media/permissions', () => ({
  ensurePermission: jest.fn(),
  isPermissionUsable: (state: string) => state === 'granted' || state === 'limited',
  openPermissionSettings: jest.fn(),
}));
jest.mock('@/shared/lib/media/camera', () => ({ takePhoto: jest.fn() }));
jest.mock('@/shared/lib/alert', () => ({ showAlert: jest.fn() }));
jest.mock('@/shared/lib/toast', () => ({ showToast: jest.fn() }));

const { takePhotoWithPermission } = require('@/shared/lib/media/capture');
const { ensurePermission, openPermissionSettings } = require('@/shared/lib/media/permissions');
const { takePhoto } = require('@/shared/lib/media/camera');
const { showAlert } = require('@/shared/lib/alert');
const { showToast } = require('@/shared/lib/toast');
const { MediaError } = require('@/shared/lib/media/mediaError');

const PHOTO = { uri: 'file:///photo.jpg', width: 4000, height: 3000 };

describe('takePhotoWithPermission', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the photo when the camera is allowed', async () => {
    ensurePermission.mockResolvedValue(PERMISSION_STATES.GRANTED);
    takePhoto.mockResolvedValue(PHOTO);
    await expect(takePhotoWithPermission()).resolves.toEqual(PHOTO);
    expect(showAlert).not.toHaveBeenCalled();
  });

  it('does nothing when the user denies the dialog', async () => {
    ensurePermission.mockResolvedValue(PERMISSION_STATES.DENIED);
    await expect(takePhotoWithPermission()).resolves.toBeNull();
    expect(takePhoto).not.toHaveBeenCalled();
    expect(showAlert).not.toHaveBeenCalled();
  });

  it('offers Settings when the camera is blocked', async () => {
    ensurePermission.mockResolvedValue(PERMISSION_STATES.BLOCKED);
    await expect(takePhotoWithPermission()).resolves.toBeNull();
    expect(takePhoto).not.toHaveBeenCalled();
    const buttons = showAlert.mock.calls[0][0].buttons;
    expect(buttons).toHaveLength(2);
    buttons[1].onPress();
    expect(openPermissionSettings).toHaveBeenCalled();
  });

  it('stays silent when the user closes the camera', async () => {
    ensurePermission.mockResolvedValue(PERMISSION_STATES.GRANTED);
    takePhoto.mockRejectedValue(new MediaError(MEDIA_ERROR_CODES.CANCELLED));
    await expect(takePhotoWithPermission()).resolves.toBeNull();
    expect(showAlert).not.toHaveBeenCalled();
    expect(showToast).not.toHaveBeenCalled();
  });

  it('offers Settings when the camera itself reports no permission (iOS)', async () => {
    ensurePermission.mockResolvedValue(PERMISSION_STATES.GRANTED);
    takePhoto.mockRejectedValue(new MediaError(MEDIA_ERROR_CODES.PERMISSION_BLOCKED));
    await takePhotoWithPermission();
    expect(showAlert).toHaveBeenCalled();
  });

  it('shows a toast when the camera is unavailable or fails', async () => {
    ensurePermission.mockResolvedValue(PERMISSION_STATES.GRANTED);
    takePhoto.mockRejectedValueOnce(new MediaError(MEDIA_ERROR_CODES.UNAVAILABLE));
    await takePhotoWithPermission();
    takePhoto.mockRejectedValueOnce(new Error('boom'));
    await takePhotoWithPermission();
    expect(showToast).toHaveBeenCalledTimes(2);
    expect(showToast.mock.calls[0][0].message).not.toBe(showToast.mock.calls[1][0].message);
  });
});
