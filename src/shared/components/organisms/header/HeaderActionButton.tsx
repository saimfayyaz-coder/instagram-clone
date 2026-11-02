import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Touchable } from '@/shared/components/atoms/ui/Touchable';
import { AppText } from '@/shared/components/atoms/ui/AppText';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import { ACCESSIBILITY_ROLES } from '@/shared/constants';

export interface HeaderActionItem {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  badgeCount?: number;
  badgeDot?: boolean;
  testID?: string;
}

export interface HeaderActionButtonProps {
  action: HeaderActionItem;
  style?: StyleProp<ViewStyle>;
}

// Icon button for the right side of a Header, with optional dot/count badge.
// Icons without an explicit color get the primary text color.
export const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({ action, style }) => {
  const { theme } = useTheme();

  const renderIcon = (icon: React.ReactNode) => {
    if (React.isValidElement(icon)) {
      const iconProps = icon.props as { color?: string };
      if (!iconProps?.color) {
        return React.cloneElement(icon, {
          color: theme.colors.textPrimary,
        } as any);
      }
    }
    return icon;
  };

  return (
    <Touchable
      onPress={action.onPress}
      hitSlop={{ top: ms(12), bottom: ms(12), left: ms(8), right: ms(8) }}
      style={[styles.iconButton, style]}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityLabel={action.accessibilityLabel}
      testID={action.testID}
    >
      {renderIcon(action.icon)}
      {action.badgeDot && !action.badgeCount && (
        <View style={[styles.badgeDot, { backgroundColor: theme.colors.error }]} />
      )}
      {Boolean(action.badgeCount && action.badgeCount > 0) && (
        <View style={[styles.badgeNumber, { backgroundColor: theme.colors.error }]}>
          <AppText variant="caption" weight="bold" color="#FFFFFF" style={styles.badgeText}>
            {action.badgeCount! > 99 ? '99+' : action.badgeCount}
          </AppText>
        </View>
      )}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: ms(28),
    minHeight: ms(28),
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: ms(-2),
    right: ms(-2),
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  badgeNumber: {
    position: 'absolute',
    top: ms(-6),
    right: ms(-8),
    minWidth: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    paddingHorizontal: ms(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: ms(10),
    lineHeight: ms(12),
  },
});
