import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { AppText, InstagramLogo, Header, headerActions, Screen } from '@/shared/ui';
import { LOGO_VARIANTS } from '@/shared/constants';
import { commonStyles } from '@/shared/theme';

export const FeedPage: React.FC = () => {
  const handleNotifications = useCallback(() => {
    // Notifications action
  }, []);

  const titleComponent = useMemo(
    () => <InstagramLogo variant={LOGO_VARIANTS.WORDMARK} size={26} />,
    [],
  );

  const rightActions = useMemo(
    () => [headerActions.notifications(handleNotifications)],
    [handleNotifications],
  );

  const header = useMemo(
    () => (
      <Header
        center={titleComponent}
        rightActions={rightActions}
      />
    ),
    [titleComponent, rightActions],
  );

  return (
    <Screen header={header}>
      <View style={commonStyles.centerFlex}>
        <AppText variant="heading" align="center">
          Feed
        </AppText>
      </View>
    </Screen>
  );
};
