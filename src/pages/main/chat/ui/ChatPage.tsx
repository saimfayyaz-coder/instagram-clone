import React from 'react';
import { View } from 'react-native';
import { AppText, Header, Screen } from '@/shared/ui';
import { commonStyles } from '@/shared/theme';

export const ChatPage: React.FC = () => {
  return (
    <Screen header={<Header title="Messages" />}>
      <View style={commonStyles.centerFlex}>
        <AppText variant="heading" align="center">
          Chat
        </AppText>
      </View>
    </Screen>
  );
};
