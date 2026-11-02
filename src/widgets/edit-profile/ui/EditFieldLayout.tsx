import React, { useCallback, useMemo } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Header } from '@/shared/components/organisms';
import { Screen, Section } from '@/shared/components/layout';
import { AppText, Icon, AppLoader } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { HEADER_BACK_ICON, HeaderBackIcon, APP_ICONS, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface EditFieldLayoutProps {
  title: string;
  onSave: () => void;
  isSaving?: boolean;
  subtitle?: string;
  extraFooter?: React.ReactNode;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  onBack?: () => void;
  backIcon?: HeaderBackIcon;
}

export const EditFieldLayout: React.FC<EditFieldLayoutProps> = ({
  title,
  onSave,
  isSaving = false,
  subtitle,
  extraFooter,
  children,
  containerStyle,
  onBack,
  backIcon = HEADER_BACK_ICON.BACK,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleGoBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onBack]);

  const rightActions = useMemo(
    () => [
      {
        icon: isSaving ? (
          <AppLoader size="small" />
        ) : (
          <Icon
            type="Ionicons"
            name={APP_ICONS.CHECKMARK}
            size={24}
            color={theme.colors.actionPrimary}
          />
        ),
        onPress: isSaving ? () => {} : onSave,
        accessibilityLabel: t(TRANSLATION_KEYS.COMMON_SAVE),
        testID: TEST_IDS.HEADER.SAVE,
      },
    ],
    [isSaving, onSave, theme.colors.actionPrimary, t],
  );

  return (
    <Screen
      header={
        <Header
          onBack={handleGoBack}
          backIcon={backIcon}
          leftTitle={title}
          rightActions={rightActions}
        />
      }
    >
      <Section style={[styles.container, containerStyle]}>
        {children}

        {subtitle && (
          <AppText
            variant="caption"
            color={theme.colors.textSecondary}
            style={styles.subtitle}
          >
            {subtitle}
          </AppText>
        )}

        {extraFooter}
      </Section>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: ms(16),
  },
  subtitle: {
    marginTop: ms(12),
    lineHeight: ms(18),
  },
});
