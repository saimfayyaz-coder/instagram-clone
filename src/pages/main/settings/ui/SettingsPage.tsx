import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '@/shared/components/atoms';
import { AppHeader } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
import { commonStyles } from '@/shared/theme';

export const SettingsPage: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScreenWrapper
      header={
        <AppHeader
          title="Settings"
          onPressBack={() => navigation.goBack()}
        />
      }
    >
      <View style={commonStyles.centerFlex}>
        <AppText variant="heading" align="center">
          Settings
        </AppText>
      </View>
    </ScreenWrapper>
  );
};
