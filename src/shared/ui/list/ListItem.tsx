import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Touchable } from '@/shared/ui/primitives/Touchable';
import { Text, TextProps } from '@/shared/ui/primitives/Text';
import { Icon } from '@/shared/ui/primitives/Icon';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import { APP_ICONS, AppIconName, ACCESSIBILITY_ROLES } from '@/shared/constants';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  // Leading icon from APP_ICONS; use `left` for anything custom (thumbnails, avatars)
  icon?: AppIconName;
  iconColor?: string;
  left?: React.ReactNode;
  // Current value shown in gray before the trailing icon (e.g. "Dark")
  value?: string;
  // Trailing content; `selected` and `chevron` render the standard trailing icons
  right?: React.ReactNode;
  selected?: boolean;
  chevron?: boolean;
  // Red title and icon for destructive actions (e.g. remove)
  destructive?: boolean;
  // Hairline under the row
  divider?: boolean;
  titleWeight?: TextProps['weight'];
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// A pressable row for lists and sheet options: [icon | left] title/subtitle [right].
export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  icon,
  iconColor,
  left,
  right,
  value,
  selected = false,
  chevron = false,
  destructive = false,
  divider = false,
  titleWeight = 'regular',
  onPress,
  accessibilityLabel,
  testID,
  style,
}) => {
  const { theme } = useTheme();
  const titleColor = destructive ? theme.colors.error : theme.colors.textPrimary;

  let trailing = right;
  if (selected) {
    trailing = (
      <Icon
        type="Ionicons"
        name={APP_ICONS.CHECKMARK}
        size={20}
        color={theme.colors.actionPrimary}
      />
    );
  } else if (chevron) {
    trailing = (
      <Icon
        type="Ionicons"
        name={APP_ICONS.CHEVRON_FORWARD}
        size={18}
        color={theme.colors.textSecondary}
      />
    );
  }

  return (
    <Touchable
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={selected ? { selected } : undefined}
      testID={testID}
      style={[
        styles.row,
        { paddingVertical: theme.layout.listItemVertical },
        divider && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.divider,
        },
        style,
      ]}
    >
      {icon && (
        <Icon
          type="Ionicons"
          name={icon}
          size={24}
          color={destructive ? theme.colors.error : iconColor ?? theme.colors.textPrimary}
          style={{ marginRight: theme.spacing.md }}
        />
      )}
      {left && <View style={{ marginRight: theme.spacing.md }}>{left}</View>}

      <View style={styles.textContainer}>
        <Text
          variant="body"
          weight={selected ? 'bold' : titleWeight}
          color={titleColor}
          numberOfLines={1}
        >
          {title}
        </Text>
        {Boolean(subtitle) && (
          <Text
            variant="caption"
            color={theme.colors.textSecondary}
            numberOfLines={1}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {Boolean(value) && (
        <Text
          variant="body"
          color={theme.colors.textSecondary}
          numberOfLines={1}
          style={[styles.value, { marginLeft: theme.spacing.sm }]}
        >
          {value}
        </Text>
      )}
      {trailing && <View style={{ marginLeft: theme.spacing.sm }}>{trailing}</View>}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: ms(2),
  },
  value: {
    maxWidth: '40%',
  },
});
