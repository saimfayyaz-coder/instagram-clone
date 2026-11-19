import React, { useCallback, useRef, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Post, PostCard, useUserPosts } from '@/entities/post';
import { PostOptionsSheet, useDeletePost } from '@/features/delete-post';
import { Loader } from '@/shared/ui';
import { commonStyles, layout, spacing } from '@/shared/theme';
import { TEST_IDS } from '@/shared/constants';
import { useLocalPostToggles } from '../model/useLocalPostToggles';

const MIN_INITIAL_RENDER = 3;

export interface UserPostsFeedWidgetProps {
  userId: string;
  // The post tapped in the grid; the list opens scrolled to it
  initialPostId: string;
  isOwnPosts: boolean;
  // Called when the last post is deleted, so the screen can close
  onEmpty: () => void;
}

export const UserPostsFeedWidget: React.FC<UserPostsFeedWidgetProps> = ({
  userId,
  initialPostId,
  isOwnPosts,
  onEmpty,
}) => {
  const listRef = useRef<FlatList<Post>>(null);
  const optionsSheetRef = useRef<BottomSheetModal>(null);
  const hasScrolledToInitial = useRef(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const { posts: cachedPosts, isLoading, isLoadingMore, loadMore } = useUserPosts(userId);
  const { posts, toggleLike, toggleSave } = useLocalPostToggles(cachedPosts);
  const { confirmDelete } = useDeletePost(userId);

  // Fixed on first render so later pages don't move the starting point
  const [initialIndex] = useState(() =>
    Math.max(0, cachedPosts.findIndex(post => post.id === initialPostId)),
  );

  const scrollToInitialPost = useCallback(() => {
    if (hasScrolledToInitial.current || initialIndex === 0 || posts.length <= initialIndex) return;
    hasScrolledToInitial.current = true;
    listRef.current?.scrollToIndex({ index: initialIndex, animated: false });
  }, [initialIndex, posts.length]);

  // Rows above the target weren't measured yet: jump close, then retry once they are
  const handleScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      listRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: false,
      });
      requestAnimationFrame(() =>
        listRef.current?.scrollToIndex({ index: info.index, animated: false }),
      );
    },
    [],
  );

  const handlePressMore = useCallback((post: Post) => {
    setSelectedPost(post);
    optionsSheetRef.current?.present();
  }, []);

  const handleDelete = useCallback(() => {
    if (!selectedPost) return;
    const isLastPost = cachedPosts.length === 1;
    confirmDelete(selectedPost, isLastPost ? onEmpty : undefined);
  }, [cachedPosts.length, confirmDelete, onEmpty, selectedPost]);

  const renderPost: ListRenderItem<Post> = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
        onPressMore={isOwnPosts ? handlePressMore : undefined}
      />
    ),
    [handlePressMore, isOwnPosts, toggleLike, toggleSave],
  );

  const renderFooter = useCallback(
    () => (isLoadingMore ? <Loader style={styles.footer} /> : null),
    [isLoadingMore],
  );

  if (isLoading) {
    return (
      <View style={commonStyles.centerFlex}>
        <Loader size="large" />
      </View>
    );
  }

  return (
    <>
      <FlatList
        ref={listRef}
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        initialNumToRender={Math.max(initialIndex + 1, MIN_INITIAL_RENDER)}
        onContentSizeChange={scrollToInitialPost}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        onEndReached={loadMore}
        onEndReachedThreshold={1}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        testID={TEST_IDS.POST.USER_POSTS_LIST}
      />

      {isOwnPosts && (
        <PostOptionsSheet bottomSheetRef={optionsSheetRef} onDelete={handleDelete} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.sm,
    paddingBottom: layout.screenBottom,
  },
  footer: {
    paddingVertical: spacing.xl,
  },
});
