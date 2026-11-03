import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Sheet, SheetHeader, ListItem, Icon } from '@/shared/ui';
import {
  BottomSheetModal,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/shared/hooks';
import { ms, commonStyles } from '@/shared/theme';
import { APP_ICONS } from '@/shared/constants';
import { MediaAlbum } from '@/shared/types';

export interface AlbumSelectSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  albums: MediaAlbum[];
  selectedAlbum: string;
  onSelectAlbum: (albumTitle: string) => void;
}

export const AlbumSelectSheet: React.FC<AlbumSelectSheetProps> = ({
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
    ({ item }: { item: MediaAlbum }) => (
      <ListItem
        title={item.title}
        subtitle={item.count.toLocaleString()}
        selected={item.title === selectedAlbum}
        onPress={() => handleSelect(item.title)}
        left={
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
        }
      />
    ),
    [selectedAlbum, theme, handleSelect],
  );

  const keyExtractor = useCallback((item: MediaAlbum) => item.title, []);

  return (
    <Sheet
      ref={bottomSheetRef as any}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <View style={[commonStyles.flex1, styles.container]}>
        <SheetHeader title="Albums" />

        <BottomSheetFlatList
          data={albums}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(16),
  },
  listContent: {
    paddingBottom: ms(32),
  },
  albumIconBox: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(8),
    borderWidth: 1,
  },
});
