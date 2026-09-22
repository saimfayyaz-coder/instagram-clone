import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { ms } from '../../../theme/scaling';
import { AppText } from '../../atoms/AppText';
import { Icon } from '../../atoms/Icon';

export interface HeaderActionItem {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  badgeCount?: number;
  badgeDot?: boolean;
  testID?: string;
}

export type HeaderLeftIconType = 'back' | 'close' | 'custom' | 'none';

export interface AppHeaderProps {
  /** Centered title string */
  title?: string;
  /** Optional centered subtitle */
  subtitle?: string;
  /** Custom component for center area (e.g., logo or search bar) */
  titleComponent?: React.ReactNode;

  /** Convenience callback for back/close navigation */
  onPressBack?: () => void;
  /** Type of left icon: 'back' (chevron), 'close' (X), 'custom', or 'none' */
  leftIconType?: HeaderLeftIconType;
  /** Custom icon for the left button (used when leftIconType is 'custom' or passed directly) */
  leftIcon?: React.ReactNode;
  /** Left button press handler (defaults to onPressBack if not explicitly set) */
  onPressLeft?: () => void;
  /** Text next to left icon or standalone left title (e.g. username on profile or home title) */
  leftText?: string;
  /** Press handler for left text */
  onPressLeftText?: () => void;
  /** Completely custom component for the left slot */
  leftComponent?: React.ReactNode;

  /** Array of right action icons (supports 0, 1, or 2 actions with badge support) */
  rightActions?: HeaderActionItem[];
  /** Completely custom component for the right slot (e.g., a "Next" / "Done" text button) */
  rightComponent?: React.ReactNode;

  /** Whether to apply top safe area inset padding (default: true) */
  withSafeArea?: boolean;
  /** Whether to show a subtle bottom border divider (default: false) */
  showBottomBorder?: boolean;
  /** Custom background color override */
  backgroundColor?: string;
  /** Custom title text style override */
  titleStyle?: StyleProp<TextStyle>;
  /** Overall container style */
  style?: StyleProp<ViewStyle>;
  /** Content row style */
  contentStyle?: StyleProp<ViewStyle>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  titleComponent,
  onPressBack,
  leftIconType,
  leftIcon,
  onPressLeft,
  leftText,
  onPressLeftText,
  leftComponent,
  rightActions = [],
  rightComponent,
  withSafeArea = true,
  showBottomBorder = false,
  backgroundColor,
  titleStyle,
  style,
  contentStyle,
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isRTL = I18nManager.isRTL;

  const handleLeftPress = onPressLeft || onPressBack;

  const resolvedLeftType: HeaderLeftIconType =
    leftIconType || (onPressBack || leftIcon ? 'back' : 'none');

  const renderLeftIcon = () => {
    if (leftIcon) return leftIcon;

    if (resolvedLeftType === 'close') {
      return (
        <Icon
          type="Ionicons"
          name="close"
          size={26}
          color={theme.colors.textPrimary}
        />
      );
    }

    if (resolvedLeftType === 'back') {
      return (
        <Icon
          type="Ionicons"
          name="chevron-back"
          size={24}
          color={theme.colors.textPrimary}
          style={isRTL ? styles.rtlFlip : undefined}
        />
      );
    }

    return null;
  };

  const hasLeftAction = Boolean(
    leftComponent ||
      leftText ||
      (handleLeftPress && resolvedLeftType !== 'none'),
  );

  const hasCenter = Boolean(title || titleComponent);

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
      <View style={[styles.contentRow, contentStyle]}>
        {/* ─── LEFT SLOT ──────────────────────────────────────────────────────── */}
        <View style={styles.leftContainer}>
          {leftComponent ? (
            leftComponent
          ) : (
            <>
              {hasLeftAction && resolvedLeftType !== 'none' && (
                <TouchableOpacity
                  onPress={handleLeftPress}
                  hitSlop={{
                    top: ms(12),
                    bottom: ms(12),
                    left: ms(12),
                    right: ms(12),
                  }}
                  style={styles.iconButton}
                  accessibilityRole="button"
                  accessibilityLabel={
                    resolvedLeftType === 'close' ? 'Close' : 'Back'
                  }
                >
                  {renderLeftIcon()}
                </TouchableOpacity>
              )}

              {leftText && (
                <TouchableOpacity
                  onPress={onPressLeftText}
                  disabled={!onPressLeftText}
                  activeOpacity={onPressLeftText ? 0.7 : 1}
                  style={styles.leftTextButton}
                >
                  <AppText
                    variant="heading"
                    weight="bold"
                    color={theme.colors.textPrimary}
                    numberOfLines={1}
                    style={styles.leftText}
                  >
                    {leftText}
                  </AppText>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {hasCenter && (
          <View style={styles.centerContainer} pointerEvents="box-none">
            {titleComponent ? (
              titleComponent
            ) : (
              <View style={styles.titleWrapper}>
                <AppText
                  variant="body"
                  weight="bold"
                  align="center"
                  color={theme.colors.textPrimary}
                  numberOfLines={1}
                  style={[styles.centerTitle, titleStyle]}
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

        {/* ─── RIGHT SLOT (0, 1, or 2 actions) ─────────────────────────────────── */}
        <View style={styles.rightContainer}>
          {rightComponent
            ? rightComponent
            : rightActions.map((action, index) => (
                <TouchableOpacity
                  key={action.testID || `header-action-${index}`}
                  onPress={action.onPress}
                  hitSlop={{
                    top: ms(12),
                    bottom: ms(12),
                    left: ms(8),
                    right: ms(8),
                  }}
                  style={[
                    styles.iconButton,
                    index > 0 && styles.rightActionSpacing,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={action.accessibilityLabel}
                  testID={action.testID}
                >
                  {action.icon}
                  {action.badgeDot && !action.badgeCount && (
                    <View
                      style={[
                        styles.badgeDot,
                        { backgroundColor: theme.colors.error },
                      ]}
                    />
                  )}
                  {Boolean(action.badgeCount && action.badgeCount > 0) && (
                    <View
                      style={[
                        styles.badgeNumber,
                        { backgroundColor: theme.colors.error },
                      ]}
                    >
                      <AppText
                        variant="caption"
                        weight="bold"
                        color="#FFFFFF"
                        style={styles.badgeText}
                      >
                        {action.badgeCount! > 99 ? '99+' : action.badgeCount}
                      </AppText>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
        </View>
      </View>
    </View>
  );
};

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
    paddingHorizontal: ms(16),
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    minWidth: ms(40),
    zIndex: 2,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: ms(28),
    minHeight: ms(28),
    position: 'relative',
  },
  leftTextButton: {
    marginLeft: ms(8),
    justifyContent: 'center',
  },
  leftText: {
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
  rtlFlip: {
    transform: [{ scaleX: -1 }],
  },
  badgeDot: {
    position: 'absolute',
    top: ms(-2),
    right: ms(-2),
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  badgeNumber: {
    position: 'absolute',
    top: ms(-6),
    right: ms(-8),
    minWidth: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    paddingHorizontal: ms(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: ms(10),
    lineHeight: ms(12),
  },
});
