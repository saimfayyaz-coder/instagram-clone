import React from 'react';
import { LoginForm } from '@/features/login-by-email';
import {
  AuthHeader,
  AuthFooter,
  AuthScreenWrapper,
} from '@/shared/components/organisms';
import { BUTTON_VARIANTS } from '@/shared/constants';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface LoginWidgetProps {
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword?: () => void;
  onRequireOtpVerification?: (email: string) => void;
}

export const LoginWidget: React.FC<LoginWidgetProps> = ({
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onRequireOtpVerification,
}) => {
  const { t } = useTranslation();

  return (
    <AuthScreenWrapper
      header={<AuthHeader showLogo />}
      footer={
        <AuthFooter
          buttonText={t(TRANSLATION_KEYS.AUTH_LOGIN_SIGN_UP)}
          buttonVariant={BUTTON_VARIANTS.OUTLINE}
          onPressButton={onNavigateToSignUp}
        />
      }
    >
      <LoginForm
        onRequireOtpVerification={onRequireOtpVerification}
        onForgotPasswordPress={onNavigateToForgotPassword}
      />
    </AuthScreenWrapper>
  );
};
