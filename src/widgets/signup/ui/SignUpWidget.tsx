import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppHeader } from '@/shared/components/organisms';
import { ResponsiveContainer, KeyboardScreenWrapper } from '@/shared/components/layout';
import { HEADER_LEFT_ICON_TYPE } from '@/shared/constants';
import { useTheme } from '@/shared/hooks/useTheme';
import { commonStyles } from '@/shared/theme';
import { ms } from '@/shared/theme/scaling';
import { SignUpStepController, useSignupFlow } from '@/features/signup';

export interface SignUpWidgetProps {
  onNavigateToLogin: () => void;
  onSignupSuccess?: () => void;
}

export const SignUpWidget: React.FC<SignUpWidgetProps> = ({
  onNavigateToLogin,
  onSignupSuccess,
}) => {
  const { theme } = useTheme();
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
    <View style={[commonStyles.flex1, { backgroundColor: theme.colors.bgPrimary }]}>
      <AppHeader
        leftIconType={
          isFirstStep
            ? HEADER_LEFT_ICON_TYPE.CLOSE
            : HEADER_LEFT_ICON_TYPE.BACK
        }
        onPressBack={handleHeaderAction}
        withSafeArea
      />

      <KeyboardScreenWrapper
        contentContainerStyle={[
          commonStyles.flexGrow1,
          styles.scrollContent,
          { paddingTop: theme.spacing.lg },
        ]}
        bottomOffset={24}
      >
        <ResponsiveContainer maxWidth={440} paddingHorizontal={theme.spacing.lg}>
          <SignUpStepController
            currentStep={currentStep}
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            onComplete={onSignupSuccess}
          />
        </ResponsiveContainer>
      </KeyboardScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: ms(32),
  },
});
