import React from 'react';
import { View } from 'react-native';
import {
  AuthScreenWrapper,
  AppHeader,
} from '@/shared/components/organisms';
import { NewPasswordForm } from '@/features/forgot-password';
import { commonStyles } from '@/shared/theme';

export interface ResetPasswordWidgetProps {
  email: string;
  resetToken: string;
  onNavigateBack: () => void;
  onResetSuccess?: () => void;
}

export const ResetPasswordWidget: React.FC<ResetPasswordWidgetProps> = ({
  email,
  resetToken,
  onNavigateBack,
  onResetSuccess,
}) => {
  return (
    <View style={commonStyles.flex1}>
      <AppHeader
        leftIconType="back"
        onPressBack={onNavigateBack}
        withSafeArea
      />

      <AuthScreenWrapper>
        <NewPasswordForm
          email={email}
          resetToken={resetToken}
          onSuccess={onResetSuccess}
        />
      </AuthScreenWrapper>
    </View>
  );
};
