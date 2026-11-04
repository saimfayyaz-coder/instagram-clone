import React from 'react';
import { AuthStepLayout } from '@/shared/ui';
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
    <AuthStepLayout onBack={onNavigateBack}>
      <NewPasswordForm
        email={email}
        resetToken={resetToken}
        onSuccess={onResetSuccess}
      />
    </AuthStepLayout>
  );
};
