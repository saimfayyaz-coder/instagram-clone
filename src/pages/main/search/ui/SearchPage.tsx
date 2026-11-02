import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/shared/components/atoms';
import { Screen } from '@/shared/components/layout';
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
