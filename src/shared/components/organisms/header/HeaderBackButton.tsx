import React from 'react';
import { StyleSheet, I18nManager } from 'react-native';
import { Touchable } from '@/shared/components/atoms/ui/Touchable';
import { Icon } from '@/shared/components/atoms/ui/Icon';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import { HEADER_BACK_ICON, HeaderBackIcon } from '@/shared/constants';

export interface HeaderBackButtonProps {
  onPress: () => void;
  icon?: HeaderBackIcon;
}

// Back chevron (flipped in RTL) or close icon for the left side of a Header.
export const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
  onPress,
  icon = HEADER_BACK_ICON.BACK,
}) => {
  const { theme } = useTheme();
  const isClose = icon === HEADER_BACK_ICON.CLOSE;

  return (
    <Touchable
      onPress={onPress}
      hitSlop={{ top: ms(12), bottom: ms(12), left: ms(12), right: ms(12) }}
      style={styles.iconButton}
      accessibilityRole="button"
      accessibilityLabel={isClose ? 'Close' : 'Back'}
    >
      {isClose ? (
        <Icon type="Ionicons" name="close" size={26} color={theme.colors.textPrimary} />
      ) : (
        <Icon
          type="Ionicons"
          name="chevron-back"
          size={24}
          color={theme.colors.textPrimary}
          style={I18nManager.isRTL ? styles.rtlFlip : undefined}
        />
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
  rtlFlip: {
    transform: [{ scaleX: -1 }],
  },
});
