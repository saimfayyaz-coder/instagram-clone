import React from 'react';
import { Image, Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { ACCESSIBILITY_ROLES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { commonStyles } from '@/shared/theme';

export interface AvatarPreviewProps {
  visible: boolean;
  uri?: string | null;
  onClose: () => void;
  testID?: string;
}

// Share of the screen's shorter side the photo fills
const PREVIEW_SCALE = 0.8;
const ZOOM_DURATION_MS = 200;

// Shows a profile picture large and round over a dark backdrop; any tap or Back closes it
export const AvatarPreview: React.FC<AvatarPreviewProps> = ({ visible, uri, onClose, testID }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();

  if (!uri) {
    return null;
  }

  const diameter = Math.min(width, height) * PREVIEW_SCALE;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={[commonStyles.centerFlex, { backgroundColor: theme.colors.mediaViewerBackdrop }]}
        onPress={onClose}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
        accessibilityLabel={t(TRANSLATION_KEYS.COMMON_CLOSE)}
        testID={testID}
      >
        <Animated.View entering={ZoomIn.duration(ZOOM_DURATION_MS)}>
          <Image
            source={{ uri }}
            style={[
              styles.image,
              {
                width: diameter,
                height: diameter,
                borderRadius: diameter / 2,
                backgroundColor: theme.colors.bgSecondary,
              },
            ]}
            resizeMode="cover"
          />
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
});
