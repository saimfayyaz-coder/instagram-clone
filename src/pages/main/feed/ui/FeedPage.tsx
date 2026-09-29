import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { AppText, InstagramLogo } from '@/shared/components/atoms';
import { AppHeader, headerActions } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
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
      <AppHeader
        titleComponent={titleComponent}
        rightActions={rightActions}
      />
    ),
    [titleComponent, rightActions],
  );

  return (
    <ScreenWrapper header={header}>
      <View style={commonStyles.centerFlex}>
        <AppText variant="heading" align="center">
          Feed
        </AppText>
      </View>
    </ScreenWrapper>
  );
};
