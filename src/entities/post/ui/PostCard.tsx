import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Avatar, Icon, Row, Section, Stack, Text } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { spacing } from '@/shared/theme';
import { APP_ICONS, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { formatRelativeTime } from '@/shared/lib/formatters';
import { Post } from '../model/types';
import { POST_CONFIG } from '../model/constants';
import { PostMediaCarousel } from './PostMediaCarousel';
import { PostActions } from './PostActions';

export interface PostCardProps {
  post: Post;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = memo(({ post, onToggleLike, onToggleSave }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const handleToggleLike = useCallback(() => onToggleLike(post.id), [onToggleLike, post.id]);
  const handleToggleSave = useCallback(() => onToggleSave(post.id), [onToggleSave, post.id]);

  // Double tap only likes, it never removes a like
  const handleDoubleTap = useCallback(() => {
    if (!post.isLiked) {
      onToggleLike(post.id);
    }
  }, [onToggleLike, post.id, post.isLiked]);

  const handleExpandCaption = useCallback(() => setIsCaptionExpanded(true), []);

  const isCaptionLong = post.caption.length > POST_CONFIG.CAPTION_PREVIEW_LENGTH;
  const isCaptionCut = isCaptionLong && !isCaptionExpanded;
  const visibleCaption = isCaptionCut
    ? `${post.caption.slice(0, POST_CONFIG.CAPTION_PREVIEW_LENGTH).trimEnd()}… `
    : post.caption;

  return (
    <View style={styles.container} testID={TEST_IDS.FEED.POST}>
      <Section>
        <Row justify="space-between" style={styles.header}>
          <Row gap="sm" style={styles.author}>
            <Avatar uri={post.author.avatarUrl} size="sm" />
            <View style={styles.author}>
              <Text weight="semibold" numberOfLines={1}>
                {post.author.username}
              </Text>
              {post.location ? (
                <Text variant="caption" color={theme.colors.textPrimary} numberOfLines={1}>
                  {post.location}
                </Text>
              ) : null}
            </View>
          </Row>
          <Icon type="Ionicons" name={APP_ICONS.MORE} size={20} color={theme.colors.textPrimary} />
        </Row>
      </Section>

      <PostMediaCarousel
        images={post.images}
        aspectRatio={post.aspectRatio}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
        onDoubleTap={handleDoubleTap}
      />

      <Section>
        <PostActions
          isLiked={post.isLiked}
          isSaved={post.isSaved}
          imageCount={post.images.length}
          activeIndex={activeIndex}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
        />

        <Stack gap="xs">
          <Text weight="semibold">
            {t(TRANSLATION_KEYS.FEED_LIKES, { value: post.likeCount.toLocaleString() })}
          </Text>

          <Text>
            <Text weight="semibold">{post.author.username} </Text>
            {visibleCaption}
            {isCaptionCut && (
              <Text color={theme.colors.textSecondary} onPress={handleExpandCaption}>
                {t(TRANSLATION_KEYS.FEED_MORE)}
              </Text>
            )}
          </Text>

          {post.commentCount > 0 && (
            <Text color={theme.colors.textSecondary}>
              {t(TRANSLATION_KEYS.FEED_VIEW_ALL_COMMENTS, { value: post.commentCount })}
            </Text>
          )}

          <Text variant="caption">{formatRelativeTime(t, post.createdAt)}</Text>
        </Stack>
      </Section>
    </View>
  );
});

PostCard.displayName = 'PostCard';

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.lg,
  },
  header: {
    paddingVertical: spacing.sm,
  },
  author: {
    flexShrink: 1,
  },
});
