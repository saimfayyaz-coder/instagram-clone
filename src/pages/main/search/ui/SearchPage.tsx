import React from 'react';
import { View } from 'react-native';
import { AppText, Screen } from '@/shared/ui';
import { commonStyles } from '@/shared/theme';

export const SearchPage: React.FC = () => {
  return (
    <Screen safeAreaEdges={['top']}>
      <View style={commonStyles.centerFlex}>
        <AppText variant="heading" align="center">
          Search
        </AppText>
      </View>
    </Screen>
  );
};
