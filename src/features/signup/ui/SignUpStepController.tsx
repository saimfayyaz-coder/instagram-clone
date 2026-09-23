import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { parseApiError } from '@/shared/lib/errors';
import { OtpForm } from '@/features/verify-otp';
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

    try {
      await signup({
        username: formData.username,
        password: formData.password,
        email,
        name,
      }).unwrap();

      nextStep();
    } catch (err) {
      const { message } = parseApiError(err);
      setStep3Error(message);
    }
  };

  const handleOtpSuccess = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
