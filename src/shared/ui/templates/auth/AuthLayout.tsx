import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { commonStyles, layout, spacing } from '@/shared/theme';
import { Screen, Container } from '@/shared/ui/layout';

export interface AuthLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

// Template for entry auth screens (e.g. Login): header on top, form centered,
// footer pinned to the bottom, keyboard-aware and width-capped on tablets.
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  header,
  footer,
  maxWidth = layout.authMaxWidth,
}) => {
  const { theme } = useTheme();

  return (
    <Screen
      preset="form"
      safeAreaEdges={['top', 'bottom']}
      contentStyle={[commonStyles.flexGrow1, styles.scrollContent]}
      keyboardProps={{ bottomOffset: 80 }}
    >
      <Container
        maxWidth={maxWidth}
        style={commonStyles.flexGrow1}
        contentStyle={styles.responsiveContent}
      >
        <View
          style={[
            commonStyles.flexGrow1,
            commonStyles.fullWidth,
            styles.mainBody,
            { paddingVertical: theme.spacing.lg },
          ]}
        >
          {header && <View style={commonStyles.fullWidth}>{header}</View>}
          <View style={commonStyles.fullWidth}>{children}</View>
        </View>

        {footer && (
          <View style={[commonStyles.fullWidth, styles.footerWrapper]}>{footer}</View>
        )}
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  responsiveContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  mainBody: {
    justifyContent: 'center',
  },
  footerWrapper: {
    paddingBottom: spacing.sm,
  },
});
