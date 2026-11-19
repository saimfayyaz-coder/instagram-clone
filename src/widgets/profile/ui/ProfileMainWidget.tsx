import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { User, UserLink } from '@/entities/user';
import { Post, PostGridTile, useUserPosts } from '@/entities/post';
import { EmptyState, Grid, GridRenderItemInfo, Loader } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { sanitizeUrl } from '@/shared/lib/formatters';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ProfileHeaderSection } from './sections/ProfileHeaderSection';
import { ProfileBioSection } from './sections/ProfileBioSection';
import { ProfileActionsSection } from './sections/ProfileActionsSection';
import { ProfileTabsBar } from './tabs/ProfileTabsBar';
import { ProfilePostsEmptyState } from './tabs/ProfilePostsEmptyState';
import { ProfileLinksSheet } from './sheets/ProfileLinksSheet';
import { APP_ICONS, PROFILE_GRID, PROFILE_TABS, ProfileTabType, TEST_IDS } from '@/shared/constants';
import { commonStyles, layout, spacing } from '@/shared/theme';

const NO_POSTS: Post[] = [];

export interface ProfileMainWidgetProps {
  user?: User | null;
  isCurrentUser: boolean;
  isFollowing?: boolean;
  onEditProfile?: () => void;
  onShareProfile?: () => void;
  onFollowToggle?: () => void;
  onMessage?: () => void;
  onShareFirstPhoto?: () => void;
  onPressPost?: (post: Post) => void;
  onRefresh?: () => Promise<void> | void;
  style?: StyleProp<ViewStyle>;
}

export const ProfileMainWidget: React.FC<ProfileMainWidgetProps> = ({
  user,
  isCurrentUser,
  isFollowing = false,
  onEditProfile,
  onShareProfile,
  onFollowToggle,
  onMessage,
  onShareFirstPhoto,
  onPressPost,
  onRefresh,
  style,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const linksSheetRef = useRef<BottomSheetModal>(null);
  const [activeTab, setActiveTab] = useState<ProfileTabType>(PROFILE_TABS.GRID);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    isLoadingMore,
    loadMore,
    refetch: refetchPosts,
  } = useUserPosts(user?.id);

  const links: UserLink[] = user?.links || [];
  const isGridTab = activeTab === PROFILE_TABS.GRID;

  const handleOpenLinksSheet = useCallback(() => {
    linksSheetRef.current?.present();
  }, []);

  const handleOpenLinkUrl = useCallback(async (rawUrl: string) => {
    const formatted = sanitizeUrl(rawUrl);
    try {
      await Linking.openURL(formatted);
    } catch {
      // Ignore open error
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([onRefresh?.(), refetchPosts?.()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, refetchPosts]);

  const handlePressPost = useCallback((post: Post) => onPressPost?.(post), [onPressPost]);

  const renderTile = useCallback(
    ({ item, size, height }: GridRenderItemInfo<Post>) => (
      <PostGridTile post={item} width={size} height={height} onPress={handlePressPost} />
    ),
    [handlePressPost],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  // Built once per change so the list header isn't remounted while scrolling
  const listHeader = useMemo(
    () => (
      <>
        <ProfileHeaderSection user={user} />

        <ProfileBioSection
          user={user}
          onOpenLinksSheet={handleOpenLinksSheet}
          onOpenLinkUrl={handleOpenLinkUrl}
        />

        <ProfileActionsSection
          isCurrentUser={isCurrentUser}
          isFollowing={isFollowing}
          onEditProfile={onEditProfile}
          onShareProfile={onShareProfile}
          onFollowToggle={onFollowToggle}
          onMessage={onMessage}
        />

        <ProfileTabsBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </>
    ),
    [
      user,
      handleOpenLinksSheet,
      handleOpenLinkUrl,
      isCurrentUser,
      isFollowing,
      onEditProfile,
      onShareProfile,
      onFollowToggle,
      onMessage,
      activeTab,
    ],
  );

  const listEmpty = useMemo(() => {
    if (!isGridTab) {
      return <ProfilePostsEmptyState isCurrentUser={isCurrentUser} />;
    }
    if (isPostsLoading) {
      return <Loader style={styles.status} />;
    }
    if (isPostsError) {
      return (
        <EmptyState
          icon={APP_ICONS.IMAGES}
          title={t(TRANSLATION_KEYS.POST_LOAD_FAILED)}
          actionLabel={t(TRANSLATION_KEYS.COMMON_TRY_AGAIN)}
          onAction={refetchPosts}
        />
      );
    }
    return (
      <ProfilePostsEmptyState isCurrentUser={isCurrentUser} onShareFirstPhoto={onShareFirstPhoto} />
    );
  }, [isGridTab, isPostsLoading, isPostsError, isCurrentUser, onShareFirstPhoto, refetchPosts, t]);

  const listFooter = useMemo(
    () => (isGridTab && isLoadingMore ? <Loader style={styles.status} /> : null),
    [isGridTab, isLoadingMore],
  );

  return (
    <View style={[commonStyles.flex1, style]}>
      <Grid
        data={isGridTab ? posts : NO_POSTS}
        renderItem={renderTile}
        keyExtractor={keyExtractor}
        numColumns={PROFILE_GRID.COLUMNS}
        spacing={PROFILE_GRID.SPACING}
        tileAspectRatio={PROFILE_GRID.TILE_ASPECT_RATIO}
        onEndReached={isGridTab ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.contentContainer}
        testID={TEST_IDS.PROFILE.POSTS_GRID}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.textSecondary}
            colors={[theme.colors.actionPrimary]}
          />
        }
      />

      {links.length > 1 && (
        <ProfileLinksSheet
          bottomSheetRef={linksSheetRef}
          links={links}
          onSelectLink={handleOpenLinkUrl}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: layout.screenBottom,
  },
  status: {
    paddingVertical: spacing.xl,
  },
});
