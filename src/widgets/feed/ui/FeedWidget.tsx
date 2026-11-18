import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Loader, Text } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { commonStyles, layout, spacing } from '@/shared/theme';
import { TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { Post, PostCard } from '@/entities/post';
import { useFeed } from '../model/useFeed';

// Starts loading the next page about one post before the end
const END_REACHED_THRESHOLD = 1;

export const FeedWidget: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    posts,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    refresh,
    loadMore,
    toggleLike,
    toggleSave,
  } = useFeed();

  const renderPost: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard post={item} onToggleLike={toggleLike} onToggleSave={toggleSave} />,
    [toggleLike, toggleSave],
  );

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
      <View style={commonStyles.centerFlex}>
        <Loader size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={renderPost}
      onEndReached={loadMore}
      onEndReachedThreshold={END_REACHED_THRESHOLD}
      ListFooterComponent={renderFooter}
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
    paddingBottom: layout.screenBottom,
  },
  footer: {
    paddingVertical: spacing.xl,
  },
});
