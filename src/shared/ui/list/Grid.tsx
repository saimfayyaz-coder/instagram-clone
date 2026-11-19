import React, { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  RefreshControlProps,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';

export interface GridRenderItemInfo<T> {
  item: T;
  index: number;
  // Tile width in pixels (and height, for square tiles)
  size: number;
  height: number;
}

export interface GridProps<T> {
  data: readonly T[];
  renderItem: (info: GridRenderItemInfo<T>) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  numColumns: number;
  // Gap between tiles, both across and down
  spacing?: number;
  // Width divided by height of each tile; square by default
  tileAspectRatio?: number;
  // Anything outside `data` that changes how tiles look (e.g. the selected id)
  extraData?: unknown;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
  // Scrolls with the tiles and spans the full width (e.g. a profile header)
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentContainerStyle?: { paddingBottom?: number; paddingTop?: number };
  testID?: string;
}

// A grid of equal tiles (photo pickers, profile post grids). Built on FlashList, which
// recycles tile views while scrolling instead of creating new ones, so long grids stay smooth.
export const Grid = <T,>({
  data,
  renderItem,
  keyExtractor,
  numColumns,
  spacing = 0,
  tileAspectRatio = 1,
  extraData,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent,
  ListEmptyComponent,
  ListHeaderComponent,
  refreshControl,
  contentContainerStyle,
  testID,
}: GridProps<T>) => {
  const { width: windowWidth } = useWindowDimensions();
  // Grids are usually full-bleed; the measured width takes over once known
  const [width, setWidth] = useState(windowWidth);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  const size = (width - spacing * (numColumns - 1)) / numColumns;
  const height = size / tileAspectRatio;

  const renderCell = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      // FlashList gives each column an equal cell (width / numColumns), which is a little wider
      // than a tile. Shifting each tile by its column's share of the gaps lines them up exactly.
      const offset = ((index % numColumns) * spacing) / numColumns;
      return (
        <View style={{ marginLeft: offset, marginBottom: spacing }}>
          {renderItem({ item, index, size, height })}
        </View>
      );
    },
    [height, numColumns, renderItem, size, spacing],
  );

  return (
    <View style={styles.container} onLayout={handleLayout} testID={testID}>
      <FlashList
        data={data}
        renderItem={renderCell}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        extraData={extraData}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={refreshControl}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
