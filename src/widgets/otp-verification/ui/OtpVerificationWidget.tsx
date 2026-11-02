import React from 'react';
import { AuthStepLayout } from '@/shared/ui';
import { OtpForm, OtpPurpose, VerifyOtpResponseData } from '@/entities/otp';

export interface OtpVerificationWidgetProps {
  email: string;
  purpose?: OtpPurpose;
  onNavigateToLogin: () => void;
  onVerifiedSuccess?: (data?: VerifyOtpResponseData) => void;
}

export const OtpVerificationWidget: React.FC<OtpVerificationWidgetProps> = ({
  email,
  purpose = 'login_unverified',
  onNavigateToLogin,
  onVerifiedSuccess,
}) => {
  return (
    <AuthStepLayout onBack={onNavigateToLogin}>
      <OtpForm
        email={email}
        purpose={purpose}
        onSuccess={onVerifiedSuccess}
        onBackPress={onNavigateToLogin}
      />
    </AuthStepLayout>
  );
};
