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
