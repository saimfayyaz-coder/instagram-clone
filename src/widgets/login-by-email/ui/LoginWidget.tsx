import React from 'react';
import { Alert } from 'react-native';
import {
  LoginForm,
  LoginSchemaType,
  useLoginMutation,
} from '@/features/login-by-email';
import {
  AuthHeader,
  AuthFooter,
  AuthScreenWrapper,
} from '@/shared/components/organisms';
import { parseApiError } from '@/shared/lib/errors';

export interface LoginWidgetProps {
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword?: () => void;
  onRequireOtpVerification?: (email: string) => void;
}

export const LoginWidget: React.FC<LoginWidgetProps> = ({
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onRequireOtpVerification,
}) => {
  const [login] = useLoginMutation();

  const handleLoginSubmit = async (
    values: LoginSchemaType,
    setRootError: (message: string) => void,
    setFieldError: (name: keyof LoginSchemaType, message: string) => void,
  ) => {
    try {
      await login(values).unwrap();
    } catch (err: unknown) {
      const anyErr = err as any;
      if (
        anyErr?.data?.errorCode === 'EMAIL_NOT_VERIFIED' ||
        anyErr?.data?.data?.requiresVerification
      ) {
        const email = anyErr?.data?.data?.email || values.identifier;
        if (onRequireOtpVerification) {
          onRequireOtpVerification(email);
          return;
        }
      }

      const { message, fieldErrors } = parseApiError(err);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        let hasMappedField = false;
        Object.entries(fieldErrors).forEach(([field, errorMsg]) => {
          const lowerField = field.toLowerCase();
          if (lowerField === 'email' || lowerField === 'identifier') {
            setFieldError('identifier', errorMsg);
            hasMappedField = true;
          } else if (lowerField === 'password') {
            setFieldError('password', errorMsg);
            hasMappedField = true;
          }
        });
        if (!hasMappedField) {
          setRootError(message);
        }
      } else {
        setRootError(message);
      }
    }
  };

  const handleForgotPassword = () => {
    if (onNavigateToForgotPassword) {
      onNavigateToForgotPassword();
    } else {
      Alert.alert('Forgot Password', 'Forgot Password pressed.');
    }
  };

  return (
    <AuthScreenWrapper
      header={<AuthHeader showLogo />}
      footer={
        <AuthFooter
          buttonText="Create new account"
          buttonVariant="outline"
          onPressButton={onNavigateToSignUp}
        />
      }
    >
      <LoginForm
        onSubmit={handleLoginSubmit}
        onForgotPasswordPress={handleForgotPassword}
      />
    </AuthScreenWrapper>
  );
};
