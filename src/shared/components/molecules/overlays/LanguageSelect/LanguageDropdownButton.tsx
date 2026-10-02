import React from 'react';
import { StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import { ACCESSIBILITY_ROLES } from '@/shared/constants';
import { AVAILABLE_LANGUAGES } from './LanguageSelectModal';

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
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityLabel={`Select language, current: ${currentLang.nativeName}`}
    >
      <AppText
        variant="caption"
        weight="medium"
        color={theme.colors.textSecondary}
        style={styles.text}
      >
        {currentLang.nativeName}
      </AppText>
      <Icon
        type="Feather"
        name="chevron-down"
        size={14}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
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
