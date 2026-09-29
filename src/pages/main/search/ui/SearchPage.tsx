import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/shared/components/atoms';
import { ScreenWrapper } from '@/shared/components/layout';
import { commonStyles } from '@/shared/theme';

export const SearchPage: React.FC = () => {
  return (
    <ScreenWrapper withSafeArea>
      <View style={commonStyles.centerFlex}>
        <AppText variant="heading" align="center">
          Search
        </AppText>
      </View>
    </ScreenWrapper>
  );
};
