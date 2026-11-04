export const HEADER_BACK_ICON = {
  BACK: 'back',
  CLOSE: 'close',
} as const;

export type HeaderBackIcon =
  (typeof HEADER_BACK_ICON)[keyof typeof HEADER_BACK_ICON];

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  OUTLINE: 'outline',
  FACEBOOK: 'facebook',
} as const;

export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

export const BUTTON_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

export type ButtonSize = (typeof BUTTON_SIZES)[keyof typeof BUTTON_SIZES];

export const SCREEN_PRESETS = {
  FIXED: 'fixed',
  SCROLL: 'scroll',
  FORM: 'form',
} as const;

export type ScreenPreset = (typeof SCREEN_PRESETS)[keyof typeof SCREEN_PRESETS];

export const TEXT_VARIANTS = {
  HERO: 'hero',
  HEADING: 'heading',
  SUBHEADING: 'subheading',
  BODY: 'body',
  CAPTION: 'caption',
  LINK: 'link',
  ERROR: 'error',
} as const;

export type TextVariant = (typeof TEXT_VARIANTS)[keyof typeof TEXT_VARIANTS];

export const TEXT_WEIGHTS = {
  REGULAR: 'regular',
  MEDIUM: 'medium',
  SEMIBOLD: 'semibold',
  BOLD: 'bold',
} as const;

export type TextWeight = (typeof TEXT_WEIGHTS)[keyof typeof TEXT_WEIGHTS];

export const TOAST_TYPES = {
  DEFAULT: 'default',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];

export const TOAST_POSITIONS = {
  BOTTOM: 'bottom',
  MIDDLE: 'middle',
} as const;

export type ToastPosition = (typeof TOAST_POSITIONS)[keyof typeof TOAST_POSITIONS];

export const ALERT_BUTTON_STYLES = {
  DEFAULT: 'default',
  CANCEL: 'cancel',
  DESTRUCTIVE: 'destructive',
} as const;

export type AlertButtonStyle =
  (typeof ALERT_BUTTON_STYLES)[keyof typeof ALERT_BUTTON_STYLES];

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

export const LOGO_VARIANTS = {
  ICON: 'icon',
  WORDMARK: 'wordmark',
} as const;

export type LogoVariant = (typeof LOGO_VARIANTS)[keyof typeof LOGO_VARIANTS];

export const APP_ICONS = {
  CHECKMARK_CIRCLE: 'checkmark-circle',
  CLOSE_CIRCLE: 'close-circle',
  CHECKMARK: 'checkmark',
  CHEVRON_DOWN: 'chevron-down',
  CHEVRON_FORWARD: 'chevron-forward',
  CHEVRON_BACK: 'chevron-back',
  CLOSE: 'close',
  PERSON: 'person',
  CAMERA_FILLED: 'camera',
  LINK: 'link-outline',
  CAMERA: 'camera-outline',
  IMAGES: 'images-outline',
  TRASH: 'trash-outline',
  ADD: 'add',
  GRID: 'grid-outline',
  TAGGED: 'person-outline',
  SHARE: 'share-social-outline',
  OPEN_OUTLINE: 'open-outline',
  PERSON_CIRCLE: 'person-circle-outline',
  CONTRAST: 'contrast-outline',
  LANGUAGE: 'language-outline',
} as const;

export type AppIconName = (typeof APP_ICONS)[keyof typeof APP_ICONS];

export const PROFILE_TABS = {
  GRID: 'grid',
  TAGGED: 'tagged',
} as const;

export const PROFILE_TAB = PROFILE_TABS;

export type ProfileTabType = (typeof PROFILE_TABS)[keyof typeof PROFILE_TABS];
