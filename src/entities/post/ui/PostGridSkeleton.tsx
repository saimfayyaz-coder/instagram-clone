import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/shared/ui';
import { PROFILE_GRID } from '@/shared/constants';

const DEFAULT_ROWS = 4;

export interface PostGridSkeletonProps {
  rows?: number;
}

// Gray tiles in the profile grid's shape while its first page loads.
// Built row by row with flexible tiles, so rounding can never push a tile onto the next line.
export const PostGridSkeleton: React.FC<PostGridSkeletonProps> = ({ rows = DEFAULT_ROWS }) => (
  <View>
    {Array.from({ length: rows }, (_, row) => (
      <View key={row} style={styles.row}>
        {Array.from({ length: PROFILE_GRID.COLUMNS }, (__, column) => (
          <View
            key={column}
            style={column === PROFILE_GRID.COLUMNS - 1 ? styles.lastTile : styles.tile}
          >
            <Skeleton width="100%" height="100%" borderRadius={0} />
          </View>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: PROFILE_GRID.SPACING,
  },
  tile: {
    flex: 1,
    aspectRatio: PROFILE_GRID.TILE_ASPECT_RATIO,
    marginEnd: PROFILE_GRID.SPACING,
  },
  lastTile: {
    flex: 1,
    aspectRatio: PROFILE_GRID.TILE_ASPECT_RATIO,
  },
});
