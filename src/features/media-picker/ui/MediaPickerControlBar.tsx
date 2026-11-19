import React from 'react';
import { StyleSheet } from 'react-native';
import { Touchable, Text, Icon, Row } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { ms, commonStyles, layout } from '@/shared/theme';
import { APP_ICONS, TEST_IDS } from '@/shared/constants';

export interface MediaPickerControlBarProps {
  albumLabel: string;
  onOpenAlbums: () => void;
  onTakePhoto: () => void;
  // Extra buttons shown before the camera button (e.g. multi-select)
  extraActions?: React.ReactNode;
}

// Album switcher and camera button between the preview and the photo grid
export const MediaPickerControlBar: React.FC<MediaPickerControlBarProps> = ({
  albumLabel,
  onOpenAlbums,
  onTakePhoto,
  extraActions,
}) => {
  const { theme } = useTheme();

  const cameraButton = (
    <Touchable
      testID={TEST_IDS.MEDIA_PICKER.CAMERA_BUTTON}
      style={[
        commonStyles.center,
        styles.roundButton,
        { backgroundColor: theme.colors.surface },
      ]}
      onPress={onTakePhoto}
      activeOpacity={0.7}
    >
      <Icon
        type="Ionicons"
        name={APP_ICONS.CAMERA}
        size={ms(20)}
        color={theme.colors.textPrimary}
      />
    </Touchable>
  );

  return (
    <Row
      justify="space-between"
      style={[
        styles.controlBar,
        {
          backgroundColor: theme.colors.bgPrimary,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <Touchable
        testID={TEST_IDS.MEDIA_PICKER.ALBUM_DROPDOWN_BUTTON}
        style={commonStyles.rowCenter}
        onPress={onOpenAlbums}
        activeOpacity={0.7}
      >
        <Text
          variant="body"
          weight="bold"
          color={theme.colors.textPrimary}
          style={styles.albumText}
        >
          {albumLabel}
        </Text>
        <Icon
          type="Ionicons"
          name={APP_ICONS.CHEVRON_DOWN}
          size={ms(18)}
          color={theme.colors.textPrimary}
        />
      </Touchable>

      {extraActions ? (
        <Row gap="sm">
          {extraActions}
          {cameraButton}
        </Row>
      ) : (
        cameraButton
      )}
    </Row>
  );
};

export const MEDIA_PICKER_ROUND_BUTTON_SIZE = ms(32);

const styles = StyleSheet.create({
  controlBar: {
    height: ms(44),
    paddingHorizontal: layout.gutter,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  albumText: {
    marginRight: ms(4),
  },
  roundButton: {
    width: MEDIA_PICKER_ROUND_BUTTON_SIZE,
    height: MEDIA_PICKER_ROUND_BUTTON_SIZE,
    borderRadius: MEDIA_PICKER_ROUND_BUTTON_SIZE / 2,
  },
});
