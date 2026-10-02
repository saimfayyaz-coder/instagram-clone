export const HEADER_LEFT_ICON_TYPE = {
  BACK: 'back',
  CLOSE: 'close',
  CUSTOM: 'custom',
  NONE: 'none',
} as const;

export type HeaderLeftIconType =
  (typeof HEADER_LEFT_ICON_TYPE)[keyof typeof HEADER_LEFT_ICON_TYPE];

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  OUTLINE: 'outline',
  FACEBOOK: 'facebook',
} as const;

export type ButtonVariant =
  (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];

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
  LINK: 'link-outline',
  CAMERA: 'camera-outline',
  IMAGES: 'images-outline',
  TRASH: 'trash-outline',
} as const;

export type AppIconName = (typeof APP_ICONS)[keyof typeof APP_ICONS];

