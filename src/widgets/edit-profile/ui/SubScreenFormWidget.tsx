import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
import { AppText, Icon, AppLoader } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { HEADER_LEFT_ICON_TYPE, APP_ICONS, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface SubScreenFormWidgetProps {
  title: string;
  onSave: () => void;
  isSaving?: boolean;
  subtitle?: string;
  extraFooter?: React.ReactNode;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  onPressBack?: () => void;
}

export const SubScreenFormWidget: React.FC<SubScreenFormWidgetProps> = ({
  title,
  onSave,
  isSaving = false,
  subtitle,
  extraFooter,
  children,
  containerStyle,
  onPressBack,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleGoBack = useCallback(() => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onPressBack]);

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
    <ScreenWrapper
      header={
        <AppHeader
          onPressBack={handleGoBack}
          leftIconType={HEADER_LEFT_ICON_TYPE.CLOSE}
          leftText={title}
          rightActions={rightActions}
        />
      }
    >
      <View style={[styles.container, containerStyle]}>
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
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
  },
  subtitle: {
    marginTop: ms(12),
    lineHeight: ms(18),
  },
});
