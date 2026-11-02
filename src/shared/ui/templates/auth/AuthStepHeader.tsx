import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Text } from '@/shared/ui/primitives';
import { useTheme } from '@/shared/hooks/useTheme';
import { authStepStyles, commonStyles } from '@/shared/theme';

export interface AuthStepHeaderProps {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

export const AuthStepHeader: React.FC<AuthStepHeaderProps> = ({
  title,
  subtitle,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[commonStyles.fullWidth, style]}>
      <Text
        variant="heading"
        weight="bold"
        align="left"
        color={theme.colors.textPrimary}
        style={authStepStyles.title}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          variant="body"
          color={theme.colors.textSecondary}
          align="left"
          style={[authStepStyles.subtitle, { marginBottom: theme.spacing.xl }]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};
