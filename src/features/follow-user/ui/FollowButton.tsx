import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { BUTTON_SIZES, BUTTON_VARIANTS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface FollowButtonProps {
  isFollowing: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// Blue "Follow" until followed, then a gray "Following"
export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowing,
  onPress,
  style,
  testID,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      title={t(isFollowing ? TRANSLATION_KEYS.PROFILE_FOLLOWING : TRANSLATION_KEYS.PROFILE_FOLLOW)}
      variant={isFollowing ? BUTTON_VARIANTS.SECONDARY : BUTTON_VARIANTS.PRIMARY}
      size={BUTTON_SIZES.SM}
      onPress={onPress}
      style={style}
      testID={testID}
    />
  );
};
