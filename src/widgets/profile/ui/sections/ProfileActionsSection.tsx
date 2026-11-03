import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Section, Row } from '@/shared/ui';
import { BUTTON_VARIANTS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface ProfileActionsSectionProps {
  isCurrentUser: boolean;
  isFollowing?: boolean;
  onEditProfile?: () => void;
  onShareProfile?: () => void;
  onFollowToggle?: () => void;
  onMessage?: () => void;
}

export const ProfileActionsSection: React.FC<ProfileActionsSectionProps> = ({
  isCurrentUser,
  isFollowing = false,
  onEditProfile,
  onShareProfile,
  onFollowToggle,
  onMessage,
}) => {
  const { t } = useTranslation();

  if (isCurrentUser) {
    return (
      <Section style={styles.container}>
        <Row gap="sm">
          <Button
            title={t(TRANSLATION_KEYS.PROFILE_EDIT_PROFILE)}
            variant={BUTTON_VARIANTS.SECONDARY}
            size="sm"
            onPress={onEditProfile}
            style={styles.actionBtn}
          />
          <Button
            title={t(TRANSLATION_KEYS.PROFILE_SHARE_PROFILE)}
            variant={BUTTON_VARIANTS.SECONDARY}
            size="sm"
            onPress={onShareProfile}
            style={styles.actionBtn}
          />
        </Row>
      </Section>
    );
  }

  return (
    <Section style={styles.container}>
      <Row gap="sm">
        <Button
          title={
            isFollowing
              ? t(TRANSLATION_KEYS.PROFILE_FOLLOWING)
              : t(TRANSLATION_KEYS.PROFILE_FOLLOW)
          }
          variant={isFollowing ? BUTTON_VARIANTS.SECONDARY : BUTTON_VARIANTS.PRIMARY}
          size="sm"
          onPress={onFollowToggle}
          style={styles.actionBtn}
        />
        <Button
          title={t(TRANSLATION_KEYS.PROFILE_MESSAGE)}
          variant={BUTTON_VARIANTS.SECONDARY}
          size="sm"
          onPress={onMessage}
          style={styles.actionBtn}
        />
      </Row>
    </Section>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: ms(16),
  },
  actionBtn: {
    flex: 1,
    borderRadius: ms(8),
  },
});
