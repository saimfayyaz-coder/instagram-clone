import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Skeleton } from '@/shared/ui';
import { PROFILE_GRID } from '@/shared/constants';

const DEFAULT_ROWS = 4;

export interface PostGridSkeletonProps {
  rows?: number;
}

// Gray tiles in the profile grid's shape while its first page loads
export const PostGridSkeleton: React.FC<PostGridSkeletonProps> = ({ rows = DEFAULT_ROWS }) => {
  const { width } = useWindowDimensions();
  const { COLUMNS, SPACING, TILE_ASPECT_RATIO } = PROFILE_GRID;
  const tileWidth = (width - SPACING * (COLUMNS - 1)) / COLUMNS;
  const tileHeight = tileWidth / TILE_ASPECT_RATIO;

  return (
    <View style={styles.grid}>
      {Array.from({ length: rows * COLUMNS }, (_, index) => (
        <Skeleton
          key={index}
          width={tileWidth}
          height={tileHeight}
          borderRadius={0}
          style={index % COLUMNS === COLUMNS - 1 ? styles.lastTile : styles.tile}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    marginEnd: PROFILE_GRID.SPACING,
    marginBottom: PROFILE_GRID.SPACING,
  },
  lastTile: {
    marginBottom: PROFILE_GRID.SPACING,
  },
});
