import { AUTH_ROUTES, ROOT_ROUTES } from '../constants/routes';

export type AuthStackParamList = {
  [AUTH_ROUTES.LOGIN]: undefined;
  [AUTH_ROUTES.SIGNUP]: undefined;
  [AUTH_ROUTES.OTP_VERIFICATION]: { email: string };
};

export type RootStackParamList = {
  [ROOT_ROUTES.AUTH]: undefined;
  [ROOT_ROUTES.MAIN]: undefined;
};
