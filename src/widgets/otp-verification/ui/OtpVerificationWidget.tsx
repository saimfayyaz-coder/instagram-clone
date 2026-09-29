import React from 'react';
import { AuthFlowLayout } from '@/shared/components/organisms';
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
    <AuthFlowLayout onBack={onNavigateToLogin}>
      <OtpForm
        email={email}
        purpose={purpose}
        onSuccess={onVerifiedSuccess}
        onBackPress={onNavigateToLogin}
      />
    </AuthFlowLayout>
  );
};
