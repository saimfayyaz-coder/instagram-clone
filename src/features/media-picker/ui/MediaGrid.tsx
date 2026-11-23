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
  // Shows a numbered circle on every tile; selectionOrder lists picked uris in pick order
  multiSelect?: boolean;
  selectionOrder?: string[];
}

const NUM_COLUMNS = 4;
const SPACING = 1.5;
const BADGE_SIZE = ms(22);
const NO_SELECTION: string[] = [];

export const MediaGrid: React.FC<MediaGridProps> = ({
  photos,
  selectedPhotoId,
  onSelectPhoto,
  onLoadMorePhotos,
  isLoadingMore,
  multiSelect = false,
  selectionOrder = NO_SELECTION,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Pick number when chosen, an empty circle otherwise
  const renderBadge = useCallback(
    (orderIndex: number) => {
      const isPicked = orderIndex >= 0;
      return (
        <View
          pointerEvents="none"
          style={[
            commonStyles.center,
            styles.badge,
            {
              borderColor: theme.colors.onOverlay,
              backgroundColor: isPicked ? theme.colors.actionPrimary : theme.colors.backdropOverlay,
            },
          ]}
        >
          {isPicked && (
            <Text variant="caption" weight="semibold" color={theme.colors.onPrimary}>
              {orderIndex + 1}
            </Text>
          )}
        </View>
      );
    },
    [theme.colors],
  );

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
          {multiSelect && renderBadge(selectionOrder.indexOf(item.uri))}
        </Touchable>
      );
    },
    [selectedPhotoId, onSelectPhoto, theme.colors, multiSelect, selectionOrder, renderBadge],
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
      extraData={multiSelect ? selectionOrder : selectedPhotoId}
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
  badge: {
    position: 'absolute',
    top: ms(6),
    end: ms(6),
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 1.5,
  },
  emptyContainer: {
    paddingVertical: ms(40),
  },
  footerLoader: {
    paddingVertical: ms(16),
  },
});
