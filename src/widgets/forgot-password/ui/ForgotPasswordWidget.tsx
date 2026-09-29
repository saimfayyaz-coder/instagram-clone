import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AuthScreenWrapper,
  AuthFooter,
  AppHeader,
} from '@/shared/components/organisms';
import { IdentifierForm } from '@/features/forgot-password';
import { commonStyles } from '@/shared/theme';
import { BUTTON_VARIANTS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface ForgotPasswordWidgetProps {
  onNavigateBack: () => void;
  onCodeSent: (email: string) => void;
}

export const ForgotPasswordWidget: React.FC<ForgotPasswordWidgetProps> = ({
  onNavigateBack,
  onCodeSent,
}) => {
  const { t } = useTranslation();

  return (
    <View style={commonStyles.flex1}>
      <AppHeader
        leftIconType="back"
        onPressBack={onNavigateBack}
        withSafeArea
      />

      <AuthScreenWrapper
        footer={
          <AuthFooter
            buttonText={t(TRANSLATION_KEYS.AUTH_FORGOT_PASSWORD_BACK_TO_LOGIN)}
            buttonVariant={BUTTON_VARIANTS.OUTLINE}
            onPressButton={onNavigateBack}
          />
        }
      >
        <IdentifierForm onSuccess={onCodeSent} />
      </AuthScreenWrapper>
    </View>
  );
};
