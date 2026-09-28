import React from 'react';
import { AuthFlowLayout } from '@/shared/components/organisms';
import { NewPasswordForm } from '@/features/forgot-password';

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
    <AuthFlowLayout onBack={onNavigateBack}>
      <NewPasswordForm
        email={email}
        resetToken={resetToken}
        onSuccess={onResetSuccess}
      />
    </AuthFlowLayout>
  );
};
