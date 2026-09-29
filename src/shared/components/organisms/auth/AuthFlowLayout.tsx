import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppHeader, HeaderLeftIconType } from '../header';
import { ResponsiveContainer, KeyboardScreenWrapper } from '@/shared/components/layout';
import { HEADER_LEFT_ICON_TYPE } from '@/shared/constants';
import { useTheme } from '@/shared/hooks';
import { commonStyles, ms } from '@/shared/theme';

export interface AuthFlowLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  leftIconType?: HeaderLeftIconType;
  maxWidth?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const AuthFlowLayout: React.FC<AuthFlowLayoutProps> = ({
  children,
  onBack,
  leftIconType = HEADER_LEFT_ICON_TYPE.BACK,
  maxWidth = 440,
  contentContainerStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[commonStyles.flex1, { backgroundColor: theme.colors.bgPrimary }]}>
      <AppHeader
        leftIconType={leftIconType}
        onPressBack={onBack}
        withSafeArea
      />

      <KeyboardScreenWrapper
        contentContainerStyle={[
          commonStyles.flexGrow1,
          styles.scrollContent,
          { paddingTop: theme.spacing.lg },
          contentContainerStyle,
        ]}
        bottomOffset={24}
      >
        <ResponsiveContainer maxWidth={maxWidth} paddingHorizontal={theme.spacing.lg}>
          {children}
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
