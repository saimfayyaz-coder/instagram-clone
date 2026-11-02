import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/shared/components/atoms';
import { Header } from '@/shared/components/organisms';
import { Screen } from '@/shared/components/layout';
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
