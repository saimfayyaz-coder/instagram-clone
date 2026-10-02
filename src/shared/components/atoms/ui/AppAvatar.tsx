import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { useTheme } from '@/shared/hooks';
import { palette } from '@/shared/theme';
import { ms } from '@/shared/theme/scaling';
import { Icon } from './Icon';
import { AppLoader } from '../loader/AppLoader';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface AppAvatarProps {
  uri?: string | null;
  user?: {
    avatar?: { url?: string | null } | null;
    avatarUrl?: string | null;
  } | null;
  size?: AvatarSize;
  loading?: boolean;
  showEditBadge?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  testID?: string;
}

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 24,
  sm: 32,
  md: 56,
  lg: 86,
  xl: 100,
};

const resolveDimension = (size: AvatarSize): number => {
  if (typeof size === 'number') {
    return ms(size);
  }
  return ms(SIZE_MAP[size] || SIZE_MAP.md);
};

export const AppAvatar: React.FC<AppAvatarProps> = ({
  uri,
  user,
  size = 'md',
  loading: externalLoading = false,
  showEditBadge = false,
  onPress,
  style,
  imageStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resolvedUri = user ? (user.avatar?.url || user.avatarUrl || null) : uri;

  const dimension = resolveDimension(size);
  const borderRadius = dimension / 2;
  const iconSize = dimension * 0.55;

  const isSilhouette = !resolvedUri || hasError;
  const showLoader = isLoading || externalLoading;

  const avatarContent = (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius,
          backgroundColor: theme.colors.bgSecondary,
          borderColor: theme.colors.border,
          borderWidth: StyleSheet.hairlineWidth,
        },
        style,
      ]}
      testID={testID}
    >
      {isSilhouette ? (
        <View
          style={[
            styles.fallbackContainer,
            { width: dimension, height: dimension, borderRadius },
          ]}
        >
          <Icon
            type="Ionicons"
            name="person"
            size={iconSize}
            color={theme.colors.textSecondary}
          />
        </View>
      ) : (
        <>
          <Image
            source={{ uri: resolvedUri }}
            style={[
              styles.image,
              { width: dimension, height: dimension, borderRadius },
              imageStyle,
            ]}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            resizeMode="cover"
          />

          {showLoader && (
            <View
              style={[
                styles.loadingOverlay,
                { width: dimension, height: dimension, borderRadius },
              ]}
            >
              <AppLoader size="small" color={theme.colors.textSecondary} />
            </View>
          )}
        </>
      )}

      {showEditBadge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.actionPrimary,
              borderColor: theme.colors.bgPrimary,
            },
          ]}
        >
          <Icon type="Ionicons" name="camera" size={ms(12)} color={palette.white} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        style={style}
      >
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return avatarContent;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
