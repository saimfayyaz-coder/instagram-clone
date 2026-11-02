import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, Header, Screen } from '@/shared/ui';
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
        <AppText variant="heading" align="center">
          Settings
        </AppText>
      </View>
    </Screen>
  );
};
