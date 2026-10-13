import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { AppModalBottomSheet } from '@/shared/components/molecules';
import { AppText, Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { ms, commonStyles } from '@/shared/theme';
import { APP_ICONS } from '@/shared/constants';
import { MediaAlbum } from '@/shared/types';

export interface AlbumSelectBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  albums: MediaAlbum[];
  selectedAlbum: string;
  onSelectAlbum: (albumTitle: string) => void;
}

export const AlbumSelectBottomSheet: React.FC<AlbumSelectBottomSheetProps> = ({
  bottomSheetRef,
  albums,
  selectedAlbum,
  onSelectAlbum,
}) => {
  const { theme } = useTheme();
  const snapPoints = useMemo(() => ['85%'], []);

  const handleSelect = useCallback(
    (title: string) => {
      onSelectAlbum(title);
      bottomSheetRef.current?.dismiss();
    },
    [onSelectAlbum, bottomSheetRef],
  );

  const renderItem = useCallback(
    ({ item }: { item: MediaAlbum }) => {
      const isSelected = item.title === selectedAlbum;

      return (
        <TouchableOpacity
          style={[commonStyles.rowCenter, styles.albumRow]}
          activeOpacity={0.7}
          onPress={() => handleSelect(item.title)}
        >
          <View
            style={[
              commonStyles.center,
              styles.albumIconBox,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Icon
              type="Ionicons"
              name={APP_ICONS.IMAGES}
              size={ms(22)}
              color={theme.colors.textPrimary}
            />
          </View>

          <View style={commonStyles.flex1}>
            <AppText
              variant="body"
              weight={isSelected ? 'bold' : 'medium'}
              color={theme.colors.textPrimary}
            >
              {item.title}
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.textSecondary}
              style={styles.albumCount}
            >
              {item.count.toLocaleString()}
            </AppText>
          </View>

          {isSelected && (
            <Icon
              type="Ionicons"
              name={APP_ICONS.CHECKMARK}
              size={ms(20)}
              color={theme.colors.actionPrimary}
            />
          )}
        </TouchableOpacity>
      );
    },
    [selectedAlbum, theme, handleSelect],
  );

  const keyExtractor = useCallback((item: MediaAlbum) => item.title, []);

  return (
    <AppModalBottomSheet
      ref={bottomSheetRef as any}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <View style={[commonStyles.flex1, styles.container]}>
        <View
          style={[
            commonStyles.center,
            styles.header,
            { borderBottomColor: theme.colors.border },
          ]}
        >
          <AppText variant="body" weight="bold" color={theme.colors.textPrimary}>
            Albums
          </AppText>
        </View>

        <BottomSheetFlatList
          data={albums}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </AppModalBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(16),
  },
  header: {
    paddingVertical: ms(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: ms(8),
  },
  listContent: {
    paddingBottom: ms(32),
  },
  albumRow: {
    paddingVertical: ms(10),
  },
  albumIconBox: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(8),
    borderWidth: 1,
    marginRight: ms(14),
  },
  albumCount: {
    marginTop: ms(2),
  },
});
