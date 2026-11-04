import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Touchable } from '@/shared/ui/primitives/Touchable';
import { Text } from '@/shared/ui/primitives/Text';
import { Icon } from '@/shared/ui/primitives/Icon';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms, spacing } from '@/shared/theme';
import { AppIconName, ACCESSIBILITY_ROLES } from '@/shared/constants';

export interface EmptyStateProps {
  icon: AppIconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

// Centered placeholder for screens or sections with no content yet:
// outlined icon circle, title, optional subtitle and a text action.
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { borderColor: theme.colors.textPrimary }]}>
        <Icon type="Ionicons" name={icon} size={38} color={theme.colors.textPrimary} />
      </View>

      <Text variant="heading" weight="bold" align="center" style={styles.title}>
        {title}
      </Text>

      {Boolean(subtitle) && (
        <Text
          variant="caption"
          align="center"
          color={theme.colors.textSecondary}
          style={styles.subtitle}
        >
          {subtitle}
        </Text>
      )}

      {actionLabel && onAction && (
        <Touchable
          onPress={onAction}
          activeOpacity={0.7}
          style={styles.actionBtn}
          accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
          accessibilityLabel={actionLabel}
        >
          <Text variant="body" weight="semibold" color={theme.colors.actionPrimary}>
            {actionLabel}
          </Text>
        </Touchable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.hero,
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: ms(76),
    height: ms(76),
    borderRadius: ms(38),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(16),
  },
  title: {
    marginBottom: ms(6),
  },
  subtitle: {
    lineHeight: ms(18),
    maxWidth: ms(280),
  },
  actionBtn: {
    marginTop: ms(16),
    paddingVertical: ms(6),
    paddingHorizontal: ms(12),
  },
});
