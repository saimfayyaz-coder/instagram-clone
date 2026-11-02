import React from 'react';
import { AuthStepLayout } from '@/shared/components/organisms';
import { IdentifierForm } from '@/features/forgot-password';

export interface ForgotPasswordWidgetProps {
  onNavigateBack: () => void;
  onCodeSent: (email: string) => void;
}

export const ForgotPasswordWidget: React.FC<ForgotPasswordWidgetProps> = ({
  onNavigateBack,
  onCodeSent,
}) => {
  return (
    <AuthStepLayout onBack={onNavigateBack}>
      <IdentifierForm onSuccess={onCodeSent} />
    </AuthStepLayout>
  );
};
