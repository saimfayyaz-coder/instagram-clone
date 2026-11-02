import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Header, Screen } from '@/shared/ui';
import { commonStyles } from '@/shared/theme';

export const SettingsPage: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Screen
      header={
        <Header
          title="Settings"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <View style={commonStyles.centerFlex}>
        <Text variant="heading" align="center">
          Settings
        </Text>
      </View>
    </Screen>
  );
};
