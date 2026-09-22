import { useState, useCallback } from 'react';
import { SignupFormData, SignupStep } from './types';

const initialFormData: SignupFormData = {
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  name: '',
};

export const useSignupFlow = () => {
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);

  const updateFormData = useCallback((partial: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (Math.min(prev + 1, 4) as SignupStep));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (Math.max(prev - 1, 1) as SignupStep));
  }, []);

  const goToStep = useCallback((step: SignupStep) => {
    setCurrentStep(step);
  }, []);

  const resetFlow = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
  }, []);

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    resetFlow,
  };
};
