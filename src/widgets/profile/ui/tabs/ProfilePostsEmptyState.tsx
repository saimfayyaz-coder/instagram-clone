import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Touchable, Text, Icon } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks';
import { APP_ICONS, ACCESSIBILITY_ROLES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface ProfilePostsEmptyStateProps {
  isCurrentUser: boolean;
  onShareFirstPhoto?: () => void;
}

export const ProfilePostsEmptyState: React.FC<ProfilePostsEmptyStateProps> = ({
  isCurrentUser,
  onShareFirstPhoto,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { borderColor: theme.colors.textPrimary }]}>
        <Icon
          type="Ionicons"
          name={APP_ICONS.CAMERA}
          size={38}
          color={theme.colors.textPrimary}
        />
      </View>

      <Text variant="heading" weight="bold" align="center" style={styles.title}>
        {t(TRANSLATION_KEYS.PROFILE_NO_POSTS_TITLE)}
      </Text>

      <Text
        variant="caption"
        align="center"
        color={theme.colors.textSecondary}
        style={styles.subtitle}
      >
        {t(TRANSLATION_KEYS.PROFILE_NO_POSTS_SUBTITLE)}
      </Text>

      {isCurrentUser && onShareFirstPhoto && (
        <Touchable
          onPress={onShareFirstPhoto}
          activeOpacity={0.7}
          style={styles.actionBtn}
          accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
          accessibilityLabel={t(TRANSLATION_KEYS.PROFILE_SHARE_FIRST_PHOTO)}
        >
          <Text
            variant="body"
            weight="semibold"
            color={theme.colors.actionPrimary}
          >
            {t(TRANSLATION_KEYS.PROFILE_SHARE_FIRST_PHOTO)}
          </Text>
        </Touchable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(48),
    paddingHorizontal: ms(32),
  },
  iconCircle: {
    width: ms(76),
    height: ms(76),
    borderRadius: ms(38),
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(16),
  },
  title: {
    marginBottom: ms(6),
  },
  subtitle: {
    lineHeight: ms(18),
    maxWidth: ms(280),
  },
  actionBtn: {
    marginTop: ms(16),
    paddingVertical: ms(6),
    paddingHorizontal: ms(12),
  },
});
