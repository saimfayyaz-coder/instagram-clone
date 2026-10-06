import type { AccessibilityRole } from 'react-native';

export const ACCESSIBILITY_ROLES = {
  NONE: 'none',
  BUTTON: 'button',
  LINK: 'link',
  SEARCH: 'search',
  IMAGE: 'image',
  KEYBOARDKEY: 'keyboardkey',
  TEXT: 'text',
  ADJUSTABLE: 'adjustable',
  IMAGEBUTTON: 'imagebutton',
  HEADER: 'header',
  SUMMARY: 'summary',
  ALERT: 'alert',
  CHECKBOX: 'checkbox',
  COMBOBOX: 'combobox',
  MENU: 'menu',
  MENUBAR: 'menubar',
  MENUITEM: 'menuitem',
  PROGRESSBAR: 'progressbar',
  RADIO: 'radio',
  RADIOGROUP: 'radiogroup',
  SCROLLBAR: 'scrollbar',
  SPINBUTTON: 'spinbutton',
  SWITCH: 'switch',
  TAB: 'tab',
  TABBAR: 'tabbar',
  TABLIST: 'tablist',
  TIMER: 'timer',
  LIST: 'list',
  TOOLBAR: 'toolbar',
} as const satisfies Record<string, AccessibilityRole>;

export type AccessibilityRoleType =
  (typeof ACCESSIBILITY_ROLES)[keyof typeof ACCESSIBILITY_ROLES];
