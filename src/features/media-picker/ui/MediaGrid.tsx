import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { GalleryPhotoItem } from '@/shared/hooks';
import { AppText, AppLoader } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { ms, commonStyles } from '@/shared/theme';
import { TEST_IDS } from '@/shared/constants';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface MediaGridProps {
  photos: GalleryPhotoItem[];
  selectedPhotoId?: string;
  onSelectPhoto: (photo: GalleryPhotoItem) => void;
  onLoadMorePhotos: () => void;
  isLoadingMore?: boolean;
}

const NUM_COLUMNS = 4;
const SPACING = 1.5;

export const MediaGrid: React.FC<MediaGridProps> = ({
  photos,
  selectedPhotoId,
  onSelectPhoto,
  onLoadMorePhotos,
  isLoadingMore,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const itemSize = (windowWidth - SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const renderItem = useCallback(
    ({ item }: { item: GalleryPhotoItem }) => {
      const isSelected = item.id === selectedPhotoId;

      return (
        <TouchableOpacity
          testID={TEST_IDS.MEDIA_PICKER.GRID_ITEM}
          activeOpacity={0.8}
          onPress={() => onSelectPhoto(item)}
          style={[
            styles.itemContainer,
            {
              width: itemSize,
              height: itemSize,
              backgroundColor: theme.colors.avatarShimmer,
            },
          ]}
        >
          <Image
            source={{ uri: item.uri }}
            style={[commonStyles.fullWidth, styles.image]}
            resizeMode="cover"
          />
          {isSelected && (
            <View
              style={[
                styles.selectedOverlay,
                {
                  borderColor: theme.colors.borderFocus,
                  backgroundColor: theme.colors.backdropOverlay,
                },
              ]}
            />
          )}
        </TouchableOpacity>
      );
    },
    [itemSize, selectedPhotoId, onSelectPhoto, theme.colors],
  );

  const keyExtractor = useCallback((item: GalleryPhotoItem) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={[commonStyles.center, styles.footerLoader]}>
        <AppLoader size="small" />
      </View>
    );
  }, [isLoadingMore]);

  if (photos.length === 0) {
    return (
      <View style={[commonStyles.centerFlex, styles.emptyContainer]}>
        <AppText variant="body" color={theme.colors.textSecondary}>
          {t(TRANSLATION_KEYS.MEDIA_PICKER_NO_PHOTOS)}
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={styles.row}
      onEndReached={onLoadMorePhotos}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      showsVerticalScrollIndicator={false}
      initialNumToRender={20}
      maxToRenderPerBatch={20}
      windowSize={7}
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  row: {
    gap: SPACING,
    marginBottom: SPACING,
  },
  itemContainer: {
    position: 'relative',
  },
  image: {
    height: '100%',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
  },
  emptyContainer: {
    paddingVertical: ms(40),
  },
  footerLoader: {
    paddingVertical: ms(16),
  },
});
