import React, { forwardRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { AppModalBottomSheet } from '../BottomSheet/AppModalBottomSheet';
import { AppText } from '../../atoms/AppText';
import { Icon } from '../../atoms/Icon';
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

export interface LanguageSelectModalProps {
  onLanguageSelected?: (langCode: string) => void;
  onClose?: () => void;
}

export const LanguageSelectModal = forwardRef<BottomSheetModal, LanguageSelectModalProps>(
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
      <AppModalBottomSheet
        ref={ref}
        customSnapPoints={['45%', '65%']}
        onDismiss={onClose}
        showBackdrop
      >
        <BottomSheetView style={styles.content}>
          <View style={[styles.header, { borderBottomColor: theme.colors.divider }]}>
            <AppText variant="subheading" weight="bold" color={theme.colors.textPrimary}>
              {t(TRANSLATION_KEYS.SETTINGS_SELECT_LANGUAGE)}
            </AppText>
          </View>

          <View style={styles.listContainer}>
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected =
                currentLang === lang.code || currentLang.startsWith(`${lang.code}-`);

              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageRow,
                    { borderBottomColor: theme.colors.divider },
                  ]}
                  onPress={() => handleSelectLanguage(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.labelContainer}>
                    <AppText
                      variant="body"
                      weight={isSelected ? 'bold' : 'regular'}
                      color={theme.colors.textPrimary}
                    >
                      {lang.nativeName}
                    </AppText>
                    {lang.name !== lang.nativeName && (
                      <AppText
                        variant="caption"
                        color={theme.colors.textSecondary}
                        style={styles.subLabel}
                      >
                        {lang.name}
                      </AppText>
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
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetView>
      </AppModalBottomSheet>
    );
  }
);

LanguageSelectModal.displayName = 'LanguageSelectModal';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: ms(20),
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
