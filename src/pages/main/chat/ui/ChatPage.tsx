import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/shared/components/atoms';
import { AppHeader } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
import { commonStyles } from '@/shared/theme';

export const ChatPage: React.FC = () => {
  return (
    <ScreenWrapper header={<AppHeader title="Messages" />}>
      <View style={commonStyles.centerFlex}>
        <AppText variant="heading" align="center">
          Chat
        </AppText>
      </View>
    </ScreenWrapper>
  );
};
