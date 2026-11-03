import React from 'react';
import { StyleSheet, I18nManager } from 'react-native';
import { Touchable } from '@/shared/ui/primitives/Touchable';
import { Icon } from '@/shared/ui/primitives/Icon';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import {
  HEADER_BACK_ICON,
  HeaderBackIcon,
  APP_ICONS,
  ACCESSIBILITY_ROLES,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface HeaderBackButtonProps {
  onPress: () => void;
  icon?: HeaderBackIcon;
}

// Back chevron (flipped in RTL) or close icon for the left side of a Header.
export const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
  onPress,
  icon = HEADER_BACK_ICON.BACK,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isClose = icon === HEADER_BACK_ICON.CLOSE;

  return (
    <Touchable
      onPress={onPress}
      hitSlop={{ top: ms(12), bottom: ms(12), left: ms(12), right: ms(12) }}
      style={styles.iconButton}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityLabel={t(isClose ? TRANSLATION_KEYS.COMMON_CLOSE : TRANSLATION_KEYS.COMMON_BACK)}
    >
      {isClose ? (
        <Icon type="Ionicons" name={APP_ICONS.CLOSE} size={26} color={theme.colors.textPrimary} />
      ) : (
        <Icon
          type="Ionicons"
          name={APP_ICONS.CHEVRON_BACK}
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
