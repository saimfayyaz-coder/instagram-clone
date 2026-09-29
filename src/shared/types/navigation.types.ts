import { AUTH_ROUTES, ROOT_ROUTES } from '../constants/routes';

export type AuthStackParamList = {
  [AUTH_ROUTES.LOGIN]: undefined;
  [AUTH_ROUTES.SIGNUP]: undefined;
  [AUTH_ROUTES.OTP_VERIFICATION]: {
    email: string;
    flowContext?: 'login_unverified' | 'forgot_password';
  };
  [AUTH_ROUTES.FORGOT_PASSWORD]: undefined;
  [AUTH_ROUTES.RESET_PASSWORD]: {
    email: string;
    resetToken: string;
  };
};

export type RootStackParamList = {
  [ROOT_ROUTES.AUTH]: undefined;
  [ROOT_ROUTES.MAIN]: undefined;
};
