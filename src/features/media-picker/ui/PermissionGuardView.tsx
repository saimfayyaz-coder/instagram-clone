import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Icon, Button } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { ms, commonStyles, spacing } from '@/shared/theme';
import { APP_ICONS, TEST_IDS, BUTTON_VARIANTS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface PermissionGuardViewProps {
  // Only Settings can grant access now, so the button opens Settings
  blocked: boolean;
  onPress: () => void;
}

export const PermissionGuardView: React.FC<PermissionGuardViewProps> = ({
  blocked,
  onPress,
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

      <Text
        variant="heading"
        weight="bold"
        color={theme.colors.textPrimary}
        style={styles.title}
      >
        {t(TRANSLATION_KEYS.MEDIA_PICKER_PERMISSION_TITLE)}
      </Text>

      <Text
        variant="body"
        color={theme.colors.textSecondary}
        style={styles.subtitle}
      >
        {t(
          blocked
            ? TRANSLATION_KEYS.MEDIA_PICKER_PERMISSION_BLOCKED_SUBTITLE
            : TRANSLATION_KEYS.MEDIA_PICKER_PERMISSION_SUBTITLE,
        )}
      </Text>

      <Button
        testID={TEST_IDS.MEDIA_PICKER.PERMISSION_BUTTON}
        title={t(
          blocked ? TRANSLATION_KEYS.MEDIA_PICKER_OPEN_SETTINGS : TRANSLATION_KEYS.MEDIA_PICKER_TURN_ON,
        )}
        variant={BUTTON_VARIANTS.GHOST}
        textColor={theme.colors.actionPrimary}
        onPress={onPress}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
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
