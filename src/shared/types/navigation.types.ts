import type { NavigatorScreenParams } from '@react-navigation/native';
import {
  AUTH_ROUTES,
  ROOT_ROUTES,
  TAB_ROUTES,
  MAIN_ROUTES,
} from '../constants/routes';

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

export type MainTabParamList = {
  [TAB_ROUTES.FEED]: undefined;
  [TAB_ROUTES.SEARCH]: undefined;
  [TAB_ROUTES.CHAT]: undefined;
  [TAB_ROUTES.PROFILE]: undefined;
};

export type MainStackParamList = {
  [MAIN_ROUTES.TABS]: NavigatorScreenParams<MainTabParamList>;
  [MAIN_ROUTES.CHAT_CONVERSATION]?: { conversationId?: string; username?: string };
  [MAIN_ROUTES.SETTINGS]: undefined;
  [MAIN_ROUTES.EDIT_PROFILE]?: undefined;
  [MAIN_ROUTES.NOTIFICATIONS]?: undefined;
  [MAIN_ROUTES.USER_PROFILE]?: { userId?: string; username?: string };
};

export type RootStackParamList = {
  [ROOT_ROUTES.AUTH]: undefined;
  [ROOT_ROUTES.MAIN]: undefined;
};
