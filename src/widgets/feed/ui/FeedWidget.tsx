import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EmptyState, Loader, Text } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { commonStyles, layout, spacing } from '@/shared/theme';
import { APP_ICONS, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { FEED_CONFIG, Post, PostCard, PostCardSkeleton } from '@/entities/post';
import { useFeed } from '../model/useFeed';

export interface FeedWidgetProps {
  onPressAuthor?: (post: Post) => void;
  // Shown on an empty feed, e.g. to open search
  onFindPeople?: () => void;
}

export const FeedWidget: React.FC<FeedWidgetProps> = ({ onPressAuthor, onFindPeople }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    posts,
    isLoading,
    isError,
    isLoadingMore,
    isRefreshing,
    hasMore,
    refresh,
    loadMore,
    toggleLike,
    toggleSave,
  } = useFeed();

  const renderPost: ListRenderItem<Post> = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
        onPressAuthor={onPressAuthor}
      />
    ),
    [onPressAuthor, toggleLike, toggleSave],
  );

  const renderEmpty = useCallback(() => {
    if (isError) {
      return (
        <EmptyState
          icon={APP_ICONS.IMAGES}
          title={t(TRANSLATION_KEYS.POST_LOAD_FAILED)}
          actionLabel={t(TRANSLATION_KEYS.COMMON_TRY_AGAIN)}
          onAction={refresh}
          style={commonStyles.flex1}
        />
      );
    }
    return (
      <EmptyState
        icon={APP_ICONS.PEOPLE}
        title={t(TRANSLATION_KEYS.FEED_EMPTY_TITLE)}
        subtitle={t(TRANSLATION_KEYS.FEED_EMPTY_SUBTITLE)}
        actionLabel={onFindPeople ? t(TRANSLATION_KEYS.FEED_FIND_PEOPLE) : undefined}
        onAction={onFindPeople}
        style={commonStyles.flex1}
      />
    );
  }, [isError, onFindPeople, refresh, t]);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <Loader style={styles.footer} />;
    }
    if (!hasMore && posts.length > 0) {
      return (
        <View style={styles.footer}>
          <Text variant="caption" align="center">
            {t(TRANSLATION_KEYS.FEED_ALL_CAUGHT_UP)}
          </Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, posts.length, t]);

  if (isLoading) {
    return (
      <View style={styles.skeleton}>
        {Array.from({ length: FEED_CONFIG.SKELETON_POSTS }, (_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={renderPost}
      onEndReached={loadMore}
      onEndReachedThreshold={FEED_CONFIG.END_REACHED_THRESHOLD}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={theme.colors.textSecondary}
          colors={[theme.colors.actionPrimary]}
        />
      }
      testID={TEST_IDS.FEED.LIST}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingBottom: layout.screenBottom,
  },
  footer: {
    paddingVertical: spacing.xl,
  },
  skeleton: {
    flex: 1,
    overflow: 'hidden',
  },
});
