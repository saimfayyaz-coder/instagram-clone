import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Touchable } from '@/shared/components/atoms/ui/Touchable';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent } from '@/shared/components/molecules';
import { AppText, Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { ms } from '@/shared/theme';
import { APP_ICONS, ACCESSIBILITY_ROLES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { GenderType, GenderOption, GENDER_OPTIONS } from '@/entities/user';

export interface GenderSelectSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  currentGender?: GenderType;
  onSelect: (gender: GenderType) => void;
}

interface GenderOptionRowProps {
  option: GenderOption;
  isSelected: boolean;
  onSelect: (gender: GenderType) => void;
  label: string;
  theme: any;
}

const GenderOptionRow: React.FC<GenderOptionRowProps> = React.memo(
  ({ option, isSelected, onSelect, label, theme }) => {
    const handlePress = useCallback(() => {
      onSelect(option.key);
    }, [option.key, onSelect]);

    return (
      <Touchable
        style={styles.optionRow}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      >
        <AppText
          variant="body"
          color={isSelected ? theme.colors.actionPrimary : theme.colors.textPrimary}
          weight={isSelected ? 'bold' : 'regular'}
          style={styles.optionText}
        >
          {label}
        </AppText>
        {isSelected && (
          <Icon
            type="Ionicons"
            name={APP_ICONS.CHECKMARK}
            size={20}
            color={theme.colors.actionPrimary}
          />
        )}
      </Touchable>
    );
  },
);

export const GenderSelectSheet: React.FC<GenderSelectSheetProps> = ({
  bottomSheetRef,
  currentGender,
  onSelect,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleSelect = useCallback(
    (gender: GenderType) => {
      onSelect(gender);
      bottomSheetRef.current?.dismiss();
    },
    [onSelect, bottomSheetRef],
  );

  return (
    <Sheet ref={bottomSheetRef as any} enableDynamicSizing>
      <SheetContent style={styles.sheetContainer}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <AppText variant="body" weight="bold" color={theme.colors.textPrimary}>
            {t(TRANSLATION_KEYS.PROFILE_GENDER)}
          </AppText>
        </View>

        <View style={styles.optionsList}>
          {GENDER_OPTIONS.map((opt) => (
            <GenderOptionRow
              key={opt.key}
              option={opt}
              isSelected={currentGender === opt.key}
              onSelect={handleSelect}
              label={t(opt.labelKey)}
              theme={theme}
            />
          ))}
        </View>
      </SheetContent>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    paddingBottom: ms(32),
  },
  header: {
    paddingVertical: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: ms(8),
  },
  optionsList: {
    paddingTop: ms(8),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(14),
  },
  optionText: {
    fontSize: ms(15),
  },
});
