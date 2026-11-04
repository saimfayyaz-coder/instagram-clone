import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Touchable } from '@/shared/ui/primitives/Touchable';
import { useTranslation } from 'react-i18next';
import { Text, Icon } from '@/shared/ui/primitives';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import { ACCESSIBILITY_ROLES, APP_ICONS } from '@/shared/constants';
import { AVAILABLE_LANGUAGES } from '@/shared/lib/i18n/languages';

export interface LanguageDropdownButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const LanguageDropdownButton: React.FC<LanguageDropdownButtonProps> = ({
  onPress,
  style,
}) => {
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  const currentLangCode = i18n.language;
  const currentLang =
    AVAILABLE_LANGUAGES.find(
      (l) => l.code === currentLangCode || currentLangCode?.startsWith(`${l.code}-`)
    ) || AVAILABLE_LANGUAGES[0];

  return (
    <Touchable
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityLabel={`Select language, current: ${currentLang.nativeName}`}
    >
      <Text
        variant="caption"
        weight="medium"
        color={theme.colors.textSecondary}
        style={styles.text}
      >
        {currentLang.nativeName}
      </Text>
      <Icon
        type="Feather"
        name={APP_ICONS.CHEVRON_DOWN}
        size={14}
        color={theme.colors.textSecondary}
      />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(6),
    paddingHorizontal: ms(10),
    alignSelf: 'center',
  },
  text: {
    marginRight: ms(4),
  },
});
