import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Icon, Button } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { ms, commonStyles } from '@/shared/theme';
import { APP_ICONS, TEST_IDS, BUTTON_VARIANTS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface PermissionGuardViewProps {
  onPressTurnOn: () => void;
}

export const PermissionGuardView: React.FC<PermissionGuardViewProps> = ({
  onPressTurnOn,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={[commonStyles.center, styles.container, { width: windowWidth, height: windowWidth }]}>
      <View
        style={[
          commonStyles.center,
          styles.iconCircle,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Icon
          type="Ionicons"
          name={APP_ICONS.IMAGES}
          size={ms(40)}
          color={theme.colors.textPrimary}
        />
      </View>

      <AppText
        variant="heading"
        weight="bold"
        color={theme.colors.textPrimary}
        style={styles.title}
      >
        {t(TRANSLATION_KEYS.MEDIA_PICKER_PERMISSION_TITLE)}
      </AppText>

      <AppText
        variant="body"
        color={theme.colors.textSecondary}
        style={styles.subtitle}
      >
        {t(TRANSLATION_KEYS.MEDIA_PICKER_PERMISSION_SUBTITLE)}
      </AppText>

      <Button
        testID={TEST_IDS.MEDIA_PICKER.PERMISSION_TURN_ON_BUTTON}
        title={t(TRANSLATION_KEYS.MEDIA_PICKER_TURN_ON)}
        variant={BUTTON_VARIANTS.GHOST}
        textColor={theme.colors.actionPrimary}
        onPress={onPressTurnOn}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(24),
  },
  iconCircle: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
    borderWidth: 1,
    marginBottom: ms(16),
  },
  title: {
    textAlign: 'center',
    marginBottom: ms(8),
    fontSize: ms(17),
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: ms(18),
    fontSize: ms(13),
    marginBottom: ms(16),
  },
  button: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
  },
});
