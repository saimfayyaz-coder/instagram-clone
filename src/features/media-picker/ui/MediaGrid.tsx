import React, { useCallback } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Touchable, Text, Loader, Grid, GridRenderItemInfo } from '@/shared/ui';
import { MediaAsset } from '@/shared/types';
import { useTheme } from '@/shared/hooks';
import { ms, commonStyles } from '@/shared/theme';
import { TEST_IDS } from '@/shared/constants';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface MediaGridProps {
  photos: MediaAsset[];
  selectedPhotoId?: string;
  onSelectPhoto: (photo: MediaAsset) => void;
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
  const { theme } = useTheme();
  const { t } = useTranslation();

  const renderItem = useCallback(
    ({ item, size }: GridRenderItemInfo<MediaAsset>) => {
      const isSelected = item.uri === selectedPhotoId;

      return (
        <Touchable
          testID={TEST_IDS.MEDIA_PICKER.GRID_ITEM}
          activeOpacity={0.8}
          onPress={() => onSelectPhoto(item)}
          style={[
            styles.itemContainer,
            {
              width: size,
              height: size,
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
        </Touchable>
      );
    },
    [selectedPhotoId, onSelectPhoto, theme.colors],
  );

  const keyExtractor = useCallback((item: MediaAsset) => item.uri, []);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={[commonStyles.center, styles.footerLoader]}>
        <Loader size="small" />
      </View>
    );
  }, [isLoadingMore]);

  if (photos.length === 0) {
    return (
      <View style={[commonStyles.centerFlex, styles.emptyContainer]}>
        <Text variant="body" color={theme.colors.textSecondary}>
          {t(TRANSLATION_KEYS.MEDIA_PICKER_NO_PHOTOS)}
        </Text>
      </View>
    );
  }

  return (
    <Grid
      data={photos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={NUM_COLUMNS}
      spacing={SPACING}
      extraData={selectedPhotoId}
      onEndReached={onLoadMorePhotos}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
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
