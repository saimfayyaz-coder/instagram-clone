import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon, Touchable } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { iconSize, spacing } from '@/shared/theme';
import { ACCESSIBILITY_ROLES, APP_ICONS, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { Post } from '../model/types';

export interface PostGridTileProps {
  post: Post;
  width: number;
  height: number;
  onPress: (post: Post) => void;
}

export const PostGridTile: React.FC<PostGridTileProps> = memo(({ post, width, height, onPress }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const cover = post.images[0];

  const handlePress = useCallback(() => onPress(post), [onPress, post]);

  return (
    <Touchable
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityLabel={cover?.altText || t(TRANSLATION_KEYS.POST_OPEN)}
      testID={TEST_IDS.PROFILE.POST_TILE}
      style={{ width, height, backgroundColor: theme.colors.bgSecondary }}
    >
      {cover ? (
        <Image
          source={{ uri: cover.thumbUri ?? cover.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : null}

      {post.images.length > 1 && (
        <View style={styles.badge} pointerEvents="none">
          <Icon
            type="Ionicons"
            name={APP_ICONS.CAROUSEL}
            size={iconSize.sm}
            color={theme.colors.onOverlay}
          />
        </View>
      )}
    </Touchable>
  );
});

PostGridTile.displayName = 'PostGridTile';

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: spacing.sm,
    end: spacing.sm,
  },
});
