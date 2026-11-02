import React from 'react';
import { View } from 'react-native';
import { Text, Screen } from '@/shared/ui';
import { commonStyles } from '@/shared/theme';

export const SearchPage: React.FC = () => {
  return (
    <Screen safeAreaEdges={['top']}>
      <View style={commonStyles.centerFlex}>
        <Text variant="heading" align="center">
          Search
        </Text>
      </View>
    </Screen>
  );
};
