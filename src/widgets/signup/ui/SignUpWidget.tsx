import React from 'react';
import { AuthFlowLayout } from '@/shared/components/organisms';
import { HEADER_LEFT_ICON_TYPE } from '@/shared/constants';
import { SignUpStepController, useSignupFlow } from '@/features/signup';

export interface SignUpWidgetProps {
  onNavigateToLogin: () => void;
  onSignupSuccess?: () => void;
}

export const SignUpWidget: React.FC<SignUpWidgetProps> = ({
  onNavigateToLogin,
  onSignupSuccess,
}) => {
  const { currentStep, formData, updateFormData, nextStep, prevStep } =
    useSignupFlow();

  const isFirstStep = currentStep === 1;

  const handleHeaderAction = () => {
    if (isFirstStep) {
      onNavigateToLogin();
    } else {
      prevStep();
    }
  };

  return (
    <AuthFlowLayout
      onBack={handleHeaderAction}
      leftIconType={
        isFirstStep
          ? HEADER_LEFT_ICON_TYPE.CLOSE
          : HEADER_LEFT_ICON_TYPE.BACK
      }
    >
      <SignUpStepController
        currentStep={currentStep}
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        onComplete={onSignupSuccess}
      />
    </AuthFlowLayout>
  );
};
