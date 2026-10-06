import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks';
import { AppLoader, AppText } from '@/shared/components/atoms';
import { commonStyles, ms } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface LoadingHudOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingHudOverlay: React.FC<LoadingHudOverlayProps> = ({
  visible,
  message,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!visible) {
    return null;
  }

  const displayMessage = message ?? t(TRANSLATION_KEYS.COMMON_LOADING);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={[
          commonStyles.centerFlex,
          { backgroundColor: theme.colors.backdropOverlay },
        ]}
      >
        <View
          style={[
            commonStyles.rowCenter,
            styles.pill,
            { backgroundColor: theme.colors.toastBg },
          ]}
        >
          <AppLoader size="small" color={theme.colors.toastText} />
          <AppText
            variant="body"
            weight="medium"
            color={theme.colors.toastText}
            style={styles.text}
          >
            {displayMessage}
          </AppText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: ms(20),
    paddingVertical: ms(12),
    borderRadius: ms(24),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: ms(13.5),
    marginLeft: ms(10),
    letterSpacing: -0.1,
  },
});
