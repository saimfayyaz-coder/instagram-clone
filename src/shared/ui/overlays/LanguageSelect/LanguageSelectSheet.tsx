import React, { forwardRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Touchable } from '@/shared/ui/primitives/Touchable';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent } from '../Sheet';
import { Text, Icon } from '@/shared/ui/primitives';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { changeLanguage } from '@/shared/lib/i18n/i18n';

import RNRestart from 'react-native-restart';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English (US)', nativeName: 'English (US)' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

export interface LanguageSelectSheetProps {
  onLanguageSelected?: (langCode: string) => void;
  onClose?: () => void;
}

export const LanguageSelectSheet = forwardRef<BottomSheetModal, LanguageSelectSheetProps>(
  ({ onLanguageSelected, onClose }, ref) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();

    const currentLang = i18n.language;

    const handleSelectLanguage = useCallback(
      (code: string) => {
        const rtlChanged = changeLanguage(code);
        onLanguageSelected?.(code);
        if (ref && 'current' in ref && ref.current) {
          ref.current.dismiss();
        }
        if (rtlChanged) {
          setTimeout(() => {
            RNRestart.restart();
          }, 150);
        }
      },
      [onLanguageSelected, ref]
    );

    return (
      <Sheet
        ref={ref}
        snapPoints={['45%', '65%']}
        onDismiss={onClose}
        showBackdrop
      >
        <SheetContent style={styles.content}>
          <View style={[styles.header, { borderBottomColor: theme.colors.divider }]}>
            <Text variant="subheading" weight="bold" color={theme.colors.textPrimary}>
              {t(TRANSLATION_KEYS.SETTINGS_SELECT_LANGUAGE)}
            </Text>
          </View>

          <View style={styles.listContainer}>
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected =
                currentLang === lang.code || currentLang.startsWith(`${lang.code}-`);

              return (
                <Touchable
                  key={lang.code}
                  style={[
                    styles.languageRow,
                    { borderBottomColor: theme.colors.divider },
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.labelContainer}>
                    <Text
                      variant="body"
                      weight={isSelected ? 'bold' : 'regular'}
                      color={theme.colors.textPrimary}
                    >
                      {lang.nativeName}
                    </Text>
                    {lang.name !== lang.nativeName && (
                      <Text
                        variant="caption"
                        color={theme.colors.textSecondary}
                        style={styles.subLabel}
                      >
                        {lang.name}
                      </Text>
                    )}
                  </View>

                  {isSelected && (
                    <Icon
                      type="Ionicons"
                      name="checkmark-circle"
                      size={22}
                      color={theme.colors.actionPrimary}
                    />
                  )}
                </Touchable>
              );
            })}
          </View>
        </SheetContent>
      </Sheet>
    );
  }
);

LanguageSelectSheet.displayName = 'LanguageSelectSheet';

const styles = StyleSheet.create({
  content: {
    paddingBottom: ms(32),
  },
  header: {
    paddingVertical: ms(14),
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: ms(8),
  },
  listContainer: {
    paddingTop: ms(4),
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  labelContainer: {
    flexDirection: 'column',
  },
  subLabel: {
    marginTop: ms(2),
  },
});
