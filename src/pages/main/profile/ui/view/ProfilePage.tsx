import React, { useCallback, useMemo } from 'react';
import { Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader, headerActions } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
import { useAppSelector } from '@/app/store/hooks';
import { useTranslation } from 'react-i18next';
import { selectCurrentUser } from '@/entities/user';
import { ProfileMainWidget } from '@/widgets/profile';
import { MAIN_ROUTES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleOpenSettings = useCallback(() => {
    navigation.navigate(MAIN_ROUTES.SETTINGS);
  }, [navigation]);

  const handleNavigateToEditProfile = useCallback(() => {
    navigation.navigate(MAIN_ROUTES.EDIT_PROFILE);
  }, [navigation]);

  const handleShareProfile = useCallback(async () => {
    const username = currentUser?.username;
    if (!username) return;
    try {
      await Share.share({
        message: `https://instagram.com/${username}`,
      });
    } catch {
      // Ignore share cancellation
    }
  }, [currentUser?.username]);

  const rightActions = useMemo(
    () => [
      headerActions.menu(handleOpenSettings, {
        accessibilityLabel: 'Menu',
      }),
    ],
    [handleOpenSettings],
  );

  return (
    <ScreenWrapper
      header={
        <AppHeader
          title={currentUser?.username || t(TRANSLATION_KEYS.PROFILE_TITLE)}
          rightActions={rightActions}
        />
      }
    >
      <ProfileMainWidget
        user={currentUser}
        isCurrentUser={true}
        onEditProfile={handleNavigateToEditProfile}
        onShareProfile={handleShareProfile}
      />
    </ScreenWrapper>
  );
};
