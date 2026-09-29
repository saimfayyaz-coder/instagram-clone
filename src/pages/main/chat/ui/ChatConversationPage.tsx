import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppText } from '@/shared/components/atoms';
import { AppHeader } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
import { MainStackParamList } from '@/shared/types';
import { MAIN_ROUTES } from '@/shared/constants';
import { commonStyles } from '@/shared/theme';

type ChatConversationRouteProp = RouteProp<MainStackParamList, typeof MAIN_ROUTES.CHAT_CONVERSATION>;

export const ChatConversationPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ChatConversationRouteProp>();
  const title = route.params?.username || 'Chat';

  return (
    <ScreenWrapper
      header={
        <AppHeader
          title={title}
          onPressBack={() => navigation.goBack()}
        />
      }
    >
      <View style={commonStyles.centerFlex}>
        <AppText variant="heading" align="center">
          Conversation
        </AppText>
      </View>
    </ScreenWrapper>
  );
};
