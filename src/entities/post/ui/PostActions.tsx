import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon, Row, Touchable } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { commonStyles, iconSize, sizes, spacing } from '@/shared/theme';
import { ACCESSIBILITY_ROLES, APP_ICONS, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface PostActionsProps {
  isLiked: boolean;
  isSaved: boolean;
  imageCount: number;
  activeIndex: number;
  onToggleLike: () => void;
  onToggleSave: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  isLiked,
  isSaved,
  imageCount,
  activeIndex,
  onToggleLike,
  onToggleSave,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Row justify="space-between" style={styles.container}>
      <Row gap="lg">
        <Touchable
          onPress={onToggleLike}
          accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
          accessibilityLabel={t(isLiked ? TRANSLATION_KEYS.FEED_UNLIKE : TRANSLATION_KEYS.FEED_LIKE)}
          testID={TEST_IDS.FEED.LIKE_BUTTON}
        >
          <Icon
            type="Ionicons"
            name={isLiked ? APP_ICONS.HEART_FILLED : APP_ICONS.HEART}
            size={iconSize.lg}
            color={isLiked ? theme.colors.like : theme.colors.textPrimary}
          />
        </Touchable>
        <Icon type="Ionicons" name={APP_ICONS.COMMENT} size={iconSize.lg} color={theme.colors.textPrimary} />
        <Icon type="Ionicons" name={APP_ICONS.SEND} size={iconSize.lg} color={theme.colors.textPrimary} />
      </Row>

      {/* Centered on the whole row, independent of the icons on either side */}
      {imageCount > 1 && (
        <View style={[StyleSheet.absoluteFill, commonStyles.center]} pointerEvents="none">
          <Row gap="xs">
            {Array.from({ length: imageCount }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === activeIndex ? theme.colors.dotActive : theme.colors.dotInactive,
                  },
                ]}
              />
            ))}
          </Row>
        </View>
      )}

      <Touchable
        onPress={onToggleSave}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
        accessibilityLabel={t(isSaved ? TRANSLATION_KEYS.FEED_UNSAVE : TRANSLATION_KEYS.FEED_SAVE)}
        testID={TEST_IDS.FEED.SAVE_BUTTON}
      >
        <Icon
          type="Ionicons"
          name={isSaved ? APP_ICONS.BOOKMARK_FILLED : APP_ICONS.BOOKMARK}
          size={iconSize.lg}
          color={theme.colors.textPrimary}
        />
      </Touchable>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  dot: {
    width: sizes.dot,
    height: sizes.dot,
    borderRadius: sizes.dot / 2,
  },
});
