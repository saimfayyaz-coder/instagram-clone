import React, { useCallback, useState } from 'react';
import { FlatList, ListRenderItem, RefreshControl, StyleSheet, View } from 'react-native';
import { USER_LIST_CONFIG, UserListItem, UserListItemSkeleton, UserSummary } from '@/entities/user';
import { FollowButton, useFollowToggle } from '@/features/follow-user';
import { EmptyState, Loader } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { AppIconName, TEST_IDS } from '@/shared/constants';
import { layout, ms, spacing } from '@/shared/theme';

export interface UserListWidgetProps {
  users: UserSummary[];
  isLoading: boolean;
  isError: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => Promise<unknown> | void;
  onRetry?: () => void;
  onPressUser: (user: UserSummary) => void;
  emptyIcon: AppIconName;
  emptyTitle: string;
  emptySubtitle?: string;
  errorTitle: string;
  retryLabel?: string;
}

// People with a Follow button on each row; used by followers, following and search
export const UserListWidget: React.FC<UserListWidgetProps> = ({
  users,
  isLoading,
  isError,
  isLoadingMore = false,
  onLoadMore,
  onRefresh,
  onRetry,
  onPressUser,
  emptyIcon,
  emptyTitle,
  emptySubtitle,
  errorTitle,
  retryLabel,
}) => {
  const { theme } = useTheme();
  const { toggleFollow, currentUserId } = useFollowToggle();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  const renderUser: ListRenderItem<UserSummary> = useCallback(
    ({ item }) => (
      <UserListItem
        user={item}
        onPress={onPressUser}
        testID={TEST_IDS.USER_LIST.ROW}
        right={
          item.id === currentUserId ? undefined : (
            <FollowButton
              isFollowing={item.isFollowing}
              onPress={() => toggleFollow(item)}
              style={styles.followButton}
              testID={TEST_IDS.USER_LIST.FOLLOW_BUTTON}
            />
          )
        }
      />
    ),
    [currentUserId, onPressUser, toggleFollow],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View>
          {Array.from({ length: USER_LIST_CONFIG.SKELETON_ROWS }, (_, index) => (
            <UserListItemSkeleton key={index} />
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <EmptyState
          icon={emptyIcon}
          title={errorTitle}
          actionLabel={onRetry ? retryLabel : undefined}
          onAction={onRetry}
        />
      );
    }
    return <EmptyState icon={emptyIcon} title={emptyTitle} subtitle={emptySubtitle} />;
  }, [emptyIcon, emptySubtitle, emptyTitle, errorTitle, isError, isLoading, onRetry, retryLabel]);

  const renderFooter = useCallback(
    () => (isLoadingMore ? <Loader style={styles.status} /> : null),
    [isLoadingMore],
  );

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id}
      renderItem={renderUser}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.content}
      testID={TEST_IDS.USER_LIST.LIST}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.textSecondary}
            colors={[theme.colors.actionPrimary]}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: layout.gutter,
    paddingBottom: layout.screenBottom,
  },
  followButton: {
    minWidth: ms(104),
  },
  status: {
    paddingVertical: spacing.xl,
  },
});
