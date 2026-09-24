import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AuthScreenWrapper,
  AuthFooter,
  AppHeader,
} from '@/shared/components/organisms';
import { OtpForm, OtpPurpose } from '@/features/verify-otp';
import { commonStyles } from '@/shared/theme';

import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface OtpVerificationWidgetProps {
  email: string;
  purpose?: OtpPurpose;
  onNavigateToLogin: () => void;
  onVerifiedSuccess?: () => void;
}

export const OtpVerificationWidget: React.FC<OtpVerificationWidgetProps> = ({
  email,
  purpose = 'login_unverified',
  onNavigateToLogin,
  onVerifiedSuccess,
}) => {
  const { t } = useTranslation();

  return (
    <View style={commonStyles.flex1}>
      <AppHeader
        leftIconType="back"
        onPressBack={onNavigateToLogin}
        withSafeArea
      />

      <AuthScreenWrapper
        footer={
          <AuthFooter
            buttonText={t(TRANSLATION_KEYS.AUTH_LOGIN_BUTTON)}
            buttonVariant="outline"
            onPressButton={onNavigateToLogin}
          />
        }
      >
        <OtpForm
          email={email}
          purpose={purpose}
          onSuccess={onVerifiedSuccess}
          onBackPress={onNavigateToLogin}
        />
      </AuthScreenWrapper>
    </View>
  );
};

