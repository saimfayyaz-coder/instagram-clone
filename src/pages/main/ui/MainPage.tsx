import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { useAppSelector } from '@/app/store/hooks';
import { selectCurrentUser } from '@/entities/user';
import { useLogout } from '@/features/logout';

export const MainPage: React.FC = () => {
  const { theme } = useTheme();
  const currentUser = useAppSelector(selectCurrentUser);
  const { logout, isLoading } = useLogout();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.bgPrimary }]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeText: {
    marginBottom: 8,
  },
  emailText: {
    marginBottom: 24,
  },
  logoutBtn: {
    width: '100%',
    maxWidth: 280,
  },
});
