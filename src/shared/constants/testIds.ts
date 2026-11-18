export const TEST_IDS = {
  HEADER: {
    NOTIFICATIONS: 'header-action-notifications',
    MENU: 'header-action-menu',
    DIRECT: 'header-action-direct',
    CREATE: 'header-action-create',
    SETTINGS: 'header-action-settings',
    SAVE: 'header-action-save',
    BACK_BUTTON: 'header-back-button',
  },
  EDIT_PROFILE: {
    SAVE_ACTION: 'header-action-save',
    ADD_LINK_BUTTON: 'edit-profile-add-link-button',
  },
  COMMON: {
    SCREEN_WRAPPER: 'screen-wrapper',
    USER_AVATAR: 'user-avatar',
  },
  LOGIN: {
    IDENTIFIER_INPUT: 'login-identifier-input',
    PASSWORD_INPUT: 'login-password-input',
    SUBMIT_BUTTON: 'login-submit-button',
    FORGOT_PASSWORD_BUTTON: 'login-forgot-password-button',
    SIGN_UP_BUTTON: 'login-sign-up-button',
  },
  SIGNUP: {
    USERNAME_INPUT: 'signup-username-input',
  },
  FORGOT_PASSWORD: {
    IDENTIFIER_INPUT: 'forgot-password-identifier-input',
  },
  TABS: {
    FEED: 'tab-feed',
    SEARCH: 'tab-search',
    CHAT: 'tab-chat',
    PROFILE: 'tab-profile',
  },
  MEDIA_PICKER: {
    HEADER_DONE: 'media-picker-header-done',
    ALBUM_DROPDOWN_BUTTON: 'media-picker-album-dropdown-button',
    PERMISSION_BUTTON: 'media-picker-permission-button',
    GRID_ITEM: 'media-picker-grid-item',
    CAMERA_BUTTON: 'media-picker-camera-button',
  },
  PROFILE: {
    AVATAR: 'profile-avatar',
    AVATAR_PREVIEW: 'profile-avatar-preview',
  },
  CROP_PHOTO: {
    DONE: 'crop-photo-done',
    VIEWPORT: 'crop-photo-viewport',
  },
  FEED: {
    LIST: 'feed-list',
    POST: 'feed-post',
    LIKE_BUTTON: 'feed-post-like-button',
    SAVE_BUTTON: 'feed-post-save-button',
    MEDIA: 'feed-post-media',
  },
  SETTINGS: {
    EDIT_PROFILE: 'settings-edit-profile',
    THEME: 'settings-theme',
    LANGUAGE: 'settings-language',
    LOGOUT: 'settings-logout',
    LOGOUT_CONFIRM: 'settings-logout-confirm',
    LOGOUT_CANCEL: 'settings-logout-cancel',
    THEME_OPTION: 'settings-theme-option',
  },
} as const;

// Suffix FormField appends to its input testID for the error text (e.g. 'login-password-input-error')
export const TEST_ID_ERROR_SUFFIX = '-error';
