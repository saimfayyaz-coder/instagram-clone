export const AUTH_ROUTES = {
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  OTP_VERIFICATION: 'OtpVerification',
  FORGOT_PASSWORD: 'ForgotPassword',
  RESET_PASSWORD: 'ResetPassword',
} as const;

export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

export const ROOT_ROUTES = {
  AUTH: 'Auth',
  MAIN: 'Main',
} as const;

export type RootRoute = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];

export const TAB_ROUTES = {
  FEED: 'FeedTab',
  SEARCH: 'SearchTab',
  CHAT: 'ChatTab',
  PROFILE: 'ProfileTab',
} as const;

export type TabRoute = (typeof TAB_ROUTES)[keyof typeof TAB_ROUTES];

export const MAIN_ROUTES = {
  TABS: 'MainTabs',
  CHAT_CONVERSATION: 'ChatConversation',
  SETTINGS: 'Settings',
  EDIT_PROFILE: 'EditProfile',
  NOTIFICATIONS: 'Notifications',
  USER_PROFILE: 'UserProfile',
} as const;

export type MainRoute = (typeof MAIN_ROUTES)[keyof typeof MAIN_ROUTES];
