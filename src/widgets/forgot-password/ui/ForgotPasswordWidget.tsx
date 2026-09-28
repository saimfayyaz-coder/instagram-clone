import React from 'react';
import { AuthFlowLayout } from '@/shared/components/organisms';
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
    <AuthFlowLayout onBack={onNavigateBack}>
      <IdentifierForm onSuccess={onCodeSent} />
    </AuthFlowLayout>
  );
};
