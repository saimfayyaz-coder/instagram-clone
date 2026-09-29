import React, { useState } from 'react';
import { View } from 'react-native';
import { commonStyles } from '@/shared/theme';
import { API_ERROR_CODES } from '@/shared/constants';
import { executeFormMutation } from '@/shared/lib/forms';
import { OtpForm } from '@/entities/otp';
import { SignupFormData, SignupStep } from '../model/types';
import { useSignupMutation } from '../api/signupApi';
import { StepUsername } from './StepUsername/StepUsername';
import { StepPassword } from './StepPassword/StepPassword';
import { StepEmail } from './StepEmail/StepEmail';

export interface SignUpStepControllerProps {
  currentStep: SignupStep;
  formData: SignupFormData;
  updateFormData: (partial: Partial<SignupFormData>) => void;
  nextStep: () => void;
  onComplete?: () => void;
}

export const SignUpStepController: React.FC<SignUpStepControllerProps> = ({
  currentStep,
  formData,
  updateFormData,
  nextStep,
  onComplete,
}) => {
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [step3Error, setStep3Error] = useState<string | null>(null);

  const handleStep1Next = (username: string) => {
    updateFormData({ username });
    nextStep();
  };

  const handleStep2Next = (password: string, confirmPassword: string) => {
    updateFormData({ password, confirmPassword });
    nextStep();
  };

  const handleStep3Submit = async (email: string, name: string) => {
    setStep3Error(null);
    updateFormData({ email, name });

    await executeFormMutation({
      mutationPromise: signup({
        username: formData.username,
        password: formData.password,
        email,
        name,
      }).unwrap(),
      onSuccess: () => {
        nextStep();
      },
      onError: (err) => {
        // Only mark the email field red if it's an actual email error (not network/offline)
        if (err.fieldErrors?.email) {
          setStep3Error(err.fieldErrors.email);
        } else if (err.code === API_ERROR_CODES.EMAIL_ALREADY_EXISTS) {
          setStep3Error(err.message);
        }
      },
    });
  };

  const handleOtpSuccess = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <View style={commonStyles.fullWidth}>
      {currentStep === 1 && (
        <StepUsername
          initialValue={formData.username}
          onNext={handleStep1Next}
        />
      )}

      {currentStep === 2 && (
        <StepPassword
          initialPassword={formData.password}
          initialConfirmPassword={formData.confirmPassword}
          onNext={handleStep2Next}
        />
      )}

      {currentStep === 3 && (
        <StepEmail
          initialEmail={formData.email}
          initialName={formData.name}
          onSubmit={handleStep3Submit}
          isLoading={isSigningUp}
          serverError={step3Error}
        />
      )}

      {currentStep === 4 && (
        <OtpForm
          email={formData.email}
          purpose="signup"
          onSuccess={handleOtpSuccess}
        />
      )}
    </View>
  );
};
