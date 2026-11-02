import React, { useRef, useCallback } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LoginForm } from '@/features/login-by-email';
import { AuthHeader, AuthFooter, AuthLayout, LanguageSelectSheet } from '@/shared/ui';
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
  const { t, i18n } = useTranslation();
  const languageSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenLanguageSheet = useCallback(() => {
    languageSheetRef.current?.present();
  }, []);

  return (
    <>
      <AuthLayout
        header={
          <AuthHeader
            showLogo
            showLanguageSelector
            onLanguagePress={handleOpenLanguageSheet}
          />
        }
        footer={
          <AuthFooter
            buttonText={t(TRANSLATION_KEYS.AUTH_LOGIN_SIGN_UP)}
            buttonVariant={BUTTON_VARIANTS.OUTLINE}
            onPressButton={onNavigateToSignUp}
          />
        }
      >
        <LoginForm
          key={i18n.language}
          onRequireOtpVerification={onRequireOtpVerification}
          onForgotPasswordPress={onNavigateToForgotPassword}
        />
      </AuthLayout>

      <LanguageSelectSheet ref={languageSheetRef} />
    </>
  );
};
