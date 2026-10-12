import React, { useRef, useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Linking,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { User, UserLink } from '@/entities/user';
import { useTheme } from '@/shared/hooks';
import { sanitizeUrl } from '@/shared/lib/formatters';
import { ProfileHeaderSection } from './sections/ProfileHeaderSection';
import { ProfileBioSection } from './sections/ProfileBioSection';
import { ProfileActionsSection } from './sections/ProfileActionsSection';
import { ProfileTabsBar } from './tabs/ProfileTabsBar';
import { ProfilePostsEmptyState } from './tabs/ProfilePostsEmptyState';
import { ProfileLinksBottomSheet } from './sheets/ProfileLinksBottomSheet';
import { PROFILE_TABS, ProfileTabType } from '@/shared/constants';
import { commonStyles, ms } from '@/shared/theme';

export interface ProfileMainWidgetProps {
  user?: User | null;
  isCurrentUser: boolean;
  isFollowing?: boolean;
  onEditProfile?: () => void;
  onShareProfile?: () => void;
  onFollowToggle?: () => void;
  onMessage?: () => void;
  onShareFirstPhoto?: () => void;
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
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
  onRefresh,
  isRefreshing = false,
  style,
}) => {
  const { theme } = useTheme();
  const linksSheetRef = useRef<BottomSheetModal>(null);
  const [activeTab, setActiveTab] = useState<ProfileTabType>(PROFILE_TABS.GRID);

  const links: UserLink[] = user?.links || [];

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

  return (
    <>
      <ScrollView
        style={[commonStyles.flex1, style]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.textSecondary}
              colors={[theme.colors.actionPrimary]}
            />
          ) : undefined
        }
      >
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

        <ProfileTabsBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {activeTab === PROFILE_TABS.GRID ? (
          <ProfilePostsEmptyState
            isCurrentUser={isCurrentUser}
            onShareFirstPhoto={onShareFirstPhoto}
          />
        ) : (
          <ProfilePostsEmptyState
            isCurrentUser={isCurrentUser}
          />
        )}
      </ScrollView>

      {links.length > 1 && (
        <ProfileLinksBottomSheet
          bottomSheetRef={linksSheetRef}
          links={links}
          onSelectLink={handleOpenLinkUrl}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: ms(40),
  },
});
