import React from 'react';
import { AuthStepLayout } from '@/shared/components/organisms';
import { HEADER_BACK_ICON } from '@/shared/constants';
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
    <AuthStepLayout
      onBack={handleHeaderAction}
      backIcon={
        isFirstStep
          ? HEADER_BACK_ICON.CLOSE
          : HEADER_BACK_ICON.BACK
      }
    >
      <SignUpStepController
        currentStep={currentStep}
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        onComplete={onSignupSuccess}
      />
    </AuthStepLayout>
  );
};
