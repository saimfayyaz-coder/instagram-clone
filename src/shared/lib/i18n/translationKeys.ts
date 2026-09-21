

export enum TRANSLATION_KEYS {
  // ─── Common ───────────────────────────────────────────────────────────────
  COMMON_OR = 'common.or',
  COMMON_LOADING = 'common.loading',
  COMMON_ERROR = 'common.error',
  COMMON_TRY_AGAIN = 'common.tryAgain',

  // ─── Auth › Login ─────────────────────────────────────────────────────────
  AUTH_LOGIN_IDENTIFIER_PLACEHOLDER = 'auth.login.identifierPlaceholder',
  AUTH_LOGIN_PASSWORD_PLACEHOLDER = 'auth.login.passwordPlaceholder',
  AUTH_LOGIN_FORGOT_PASSWORD = 'auth.login.forgotPassword',
  AUTH_LOGIN_BUTTON = 'auth.login.logInButton',
  AUTH_LOGIN_WITH_FACEBOOK = 'auth.login.loginWithFacebook',
  AUTH_LOGIN_DONT_HAVE_ACCOUNT = 'auth.login.dontHaveAccount',
  AUTH_LOGIN_SIGN_UP = 'auth.login.signUp',
  AUTH_LOGIN_IDENTIFIER_REQUIRED = 'auth.login.identifierRequired',
  AUTH_LOGIN_PASSWORD_REQUIRED = 'auth.login.passwordRequired',
  AUTH_LOGIN_PASSWORD_MIN_LENGTH = 'auth.login.passwordMinLength',

  // ─── Settings ─────────────────────────────────────────────────────────────
  SETTINGS_THEME = 'settings.theme',
  SETTINGS_LANGUAGE = 'settings.language',
  SETTINGS_SYSTEM = 'settings.system',
  SETTINGS_LIGHT = 'settings.light',
  SETTINGS_DARK = 'settings.dark',

  // ─── Errors — mirror server ErrorCodes.js 1-to-1 ─────────────────────────
  ERROR_INVALID_CREDENTIALS = 'errors.INVALID_CREDENTIALS',
  ERROR_EMAIL_ALREADY_EXISTS = 'errors.EMAIL_ALREADY_EXISTS',
  ERROR_USER_NOT_FOUND = 'errors.USER_NOT_FOUND',
  ERROR_VALIDATION_FAILED = 'errors.VALIDATION_FAILED',
  ERROR_DEVICE_TOKEN_REQUIRED = 'errors.DEVICE_TOKEN_REQUIRED',
  ERROR_TOKEN_REQUIRED = 'errors.TOKEN_REQUIRED',
  ERROR_TOKEN_EXPIRED = 'errors.TOKEN_EXPIRED',
  ERROR_TOKEN_INVALID = 'errors.TOKEN_INVALID',
  ERROR_REFRESH_TOKEN_REQUIRED = 'errors.REFRESH_TOKEN_REQUIRED',
  ERROR_REFRESH_TOKEN_INVALID = 'errors.REFRESH_TOKEN_INVALID',
  ERROR_REFRESH_TOKEN_EXPIRED = 'errors.REFRESH_TOKEN_EXPIRED',
  ERROR_SERVER = 'errors.SERVER_ERROR',
  ERROR_FORBIDDEN = 'errors.FORBIDDEN',
  ERROR_NETWORK = 'errors.NETWORK_ERROR',
  ERROR_UNKNOWN = 'errors.UNKNOWN',
}
