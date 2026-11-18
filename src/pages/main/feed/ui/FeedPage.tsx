import React, { useMemo, useCallback } from 'react';
import { InstagramLogo, Header, headerActions, Screen } from '@/shared/ui';
import { LOGO_VARIANTS } from '@/shared/constants';
import { FeedWidget } from '@/widgets/feed';

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
      <FeedWidget />
    </Screen>
  );
};
