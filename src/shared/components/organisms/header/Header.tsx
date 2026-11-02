import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import { Touchable } from '@/shared/components/atoms/ui/Touchable';
import { AppText } from '@/shared/components/atoms/ui/AppText';
import { HeaderBackIcon } from '@/shared/constants';
import { HeaderBackButton } from './HeaderBackButton';
import { HeaderActionButton, HeaderActionItem } from './HeaderActionButton';

export interface HeaderProps {
  // Centered title (and optional subtitle), or a custom center element
  title?: string;
  subtitle?: string;
  center?: React.ReactNode;

  // Shows a back/close button on the left when set
  onBack?: () => void;
  backIcon?: HeaderBackIcon;
  // Large left-aligned title next to the back button (Instagram style)
  leftTitle?: string;
  // Replaces the whole left side
  left?: React.ReactNode;

  // Icon buttons on the right (see headerActions), or a custom right element
  rightActions?: HeaderActionItem[];
  right?: React.ReactNode;

  // Adds the top safe-area inset. On by default: the Header owns the top inset
  withSafeArea?: boolean;
  showBottomBorder?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  title,
  subtitle,
  center,
  onBack,
  backIcon,
  leftTitle,
  left,
  rightActions = [],
  right,
  withSafeArea = true,
  showBottomBorder = false,
  backgroundColor,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const hasCenter = Boolean(title || center);

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: withSafeArea ? insets.top : 0,
          backgroundColor: backgroundColor || theme.colors.bgPrimary,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: showBottomBorder ? 0.5 : 0,
        },
        style,
      ]}
    >
      <View style={[styles.contentRow, { paddingHorizontal: theme.layout.headerHorizontal }]}>
        <View style={styles.leftContainer}>
          {left ? (
            left
          ) : (
            <>
              {onBack && <HeaderBackButton onPress={onBack} icon={backIcon} />}

              {leftTitle && (
                <Touchable disabled activeOpacity={1} style={styles.leftTitleButton}>
                  <AppText
                    variant="heading"
                    weight="bold"
                    color={theme.colors.textPrimary}
                    numberOfLines={1}
                    style={styles.leftTitle}
                  >
                    {leftTitle}
                  </AppText>
                </Touchable>
              )}
            </>
          )}
        </View>

        {hasCenter && (
          <View style={styles.centerContainer} pointerEvents="box-none">
            {center ? (
              center
            ) : (
              <View style={styles.titleWrapper}>
                <AppText
                  variant="body"
                  weight="bold"
                  align="center"
                  color={theme.colors.textPrimary}
                  numberOfLines={1}
                  style={styles.centerTitle}
                >
                  {title}
                </AppText>
                {subtitle && (
                  <AppText
                    variant="caption"
                    align="center"
                    color={theme.colors.textSecondary}
                    numberOfLines={1}
                    style={styles.subtitle}
                  >
                    {subtitle}
                  </AppText>
                )}
              </View>
            )}
          </View>
        )}

        <View style={styles.rightContainer}>
          {right
            ? right
            : rightActions.map((action, index) => (
                <HeaderActionButton
                  key={action.testID || `header-action-${index}`}
                  action={action}
                  style={index > 0 && styles.rightActionSpacing}
                />
              ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    zIndex: 10,
  },
  contentRow: {
    height: ms(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    minWidth: ms(40),
    zIndex: 2,
  },
  leftTitleButton: {
    marginLeft: ms(8),
    justifyContent: 'center',
  },
  leftTitle: {
    fontSize: ms(20),
    letterSpacing: -0.3,
  },
  centerContainer: {
    position: 'absolute',
    left: ms(56),
    right: ms(56),
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTitle: {
    fontSize: ms(16),
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: ms(11),
    marginTop: ms(1),
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
    minWidth: ms(40),
    zIndex: 2,
  },
  rightActionSpacing: {
    marginLeft: ms(16),
  },
});
