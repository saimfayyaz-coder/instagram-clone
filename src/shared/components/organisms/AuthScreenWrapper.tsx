import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { commonStyles } from '@/shared/theme';
import { ResponsiveContainer } from '../layout/ResponsiveContainer';
import { KeyboardScreenWrapper } from '../layout/KeyboardScreenWrapper';

export interface AuthScreenWrapperProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

export const AuthScreenWrapper: React.FC<AuthScreenWrapperProps> = ({
  children,
  header,
  footer,
  maxWidth = 440,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        commonStyles.flex1,
        { backgroundColor: theme.colors.bgPrimary },
      ]}
      edges={['top', 'bottom']}
    >
      <KeyboardScreenWrapper
        contentContainerStyle={[commonStyles.flexGrow1, styles.scrollContent]}
        bottomOffset={80}
      >
        <ResponsiveContainer
          maxWidth={maxWidth}
          paddingHorizontal={theme.spacing.lg}
          style={commonStyles.flexGrow1}
          contentStyle={styles.responsiveContent}
        >
          <View style={[commonStyles.flexGrow1, commonStyles.fullWidth, styles.mainBody, { paddingVertical: theme.spacing.lg }]}>
            {header && <View style={commonStyles.fullWidth}>{header}</View>}
            <View style={commonStyles.fullWidth}>{children}</View>
          </View>

          {footer && (
            <View style={[commonStyles.fullWidth, styles.footerWrapper]}>{footer}</View>
          )}
        </ResponsiveContainer>
      </KeyboardScreenWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  responsiveContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  mainBody: {
    justifyContent: 'center',
  },
  footerWrapper: {
    paddingBottom: 8,
  },
});
