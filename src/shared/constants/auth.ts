export const OTP_PURPOSES = {
  SIGNUP: 'signup',
  LOGIN_UNVERIFIED: 'login_unverified',
  FORGOT_PASSWORD: 'forgot_password',
  CHANGE_PASSWORD: 'change_password',
} as const;

export type OtpPurpose = (typeof OTP_PURPOSES)[keyof typeof OTP_PURPOSES];

// Flows that open the OTP verification screen from another auth screen
export type OtpFlowContext =
  | typeof OTP_PURPOSES.LOGIN_UNVERIFIED
  | typeof OTP_PURPOSES.FORGOT_PASSWORD;

// Session actions dispatched from shared/api, which can't import entities/session
export const SESSION_ACTION_TYPES = {
  SET_ACCESS_TOKEN: 'session/setAccessToken',
  CLEAR_SESSION: 'session/clearSession',
} as const;
