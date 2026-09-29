import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, Button } from '@/shared/components/atoms';
import { AppHeader, headerActions } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
import { useTheme } from '@/shared/hooks';
import { useAppSelector } from '@/app/store/hooks';
import { useTranslation } from 'react-i18next';
import { selectCurrentUser } from '@/entities/user';
import { useLogout } from '@/features/logout';
import { MAIN_ROUTES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { ms } from '@/shared/theme';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const currentUser = useAppSelector(selectCurrentUser);
  const { logout, isLoading } = useLogout();
  const handleOpenSettings = React.useCallback(() => {
    navigation.navigate(MAIN_ROUTES.SETTINGS);
  }, [navigation]);

  const rightActions = React.useMemo(
    () => [headerActions.menu(handleOpenSettings)],
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
      <View style={styles.container}>
        <AppText variant="heading" align="center" style={styles.welcomeText}>
          Welcome
        </AppText>

        {currentUser?.email ? (
          <AppText
            variant="body"
            align="center"
            color={theme.colors.textSecondary}
            style={styles.emailText}
          >
            {currentUser.email}
          </AppText>
        ) : null}

        <Button
          title="Logout"
          variant="primary"
          loading={isLoading}
          onPress={logout}
          style={styles.logoutBtn}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(24),
  },
  welcomeText: {
    marginBottom: ms(8),
  },
  emailText: {
    marginBottom: ms(24),
  },
  logoutBtn: {
    width: '100%',
    maxWidth: ms(280),
  },
});
