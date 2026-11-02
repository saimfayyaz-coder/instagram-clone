import React from 'react';
import { View } from 'react-native';
import { Text, Header, Screen } from '@/shared/ui';
import { commonStyles } from '@/shared/theme';

export const ChatPage: React.FC = () => {
  return (
    <Screen header={<Header title="Messages" />}>
      <View style={commonStyles.centerFlex}>
        <Text variant="heading" align="center">
          Chat
        </Text>
      </View>
    </Screen>
  );
};
