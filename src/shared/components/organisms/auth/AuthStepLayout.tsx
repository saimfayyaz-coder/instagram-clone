import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { AppHeader, HeaderLeftIconType } from '../header';
import { Screen, Container } from '@/shared/components/layout';
import { HEADER_LEFT_ICON_TYPE } from '@/shared/constants';
import { useTheme } from '@/shared/hooks/useTheme';
import { commonStyles, layout } from '@/shared/theme';

export interface AuthStepLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  leftIconType?: HeaderLeftIconType;
  maxWidth?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

// Template for multi-step auth flows (signup, otp, forgot/reset password):
// back header, keyboard-aware content, width-capped on tablets.
export const AuthStepLayout: React.FC<AuthStepLayoutProps> = ({
  children,
  onBack,
  leftIconType = HEADER_LEFT_ICON_TYPE.BACK,
  maxWidth = layout.authMaxWidth,
  contentContainerStyle,
}) => {
  const { theme } = useTheme();

  return (
    <Screen
      preset="form"
      header={<AppHeader leftIconType={leftIconType} onPressBack={onBack} withSafeArea />}
      contentStyle={[
        commonStyles.flexGrow1,
        { paddingBottom: theme.layout.authStepBottom },
        { paddingTop: theme.spacing.lg },
        contentContainerStyle,
      ]}
      keyboardProps={{ bottomOffset: 24 }}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Screen>
  );
};
