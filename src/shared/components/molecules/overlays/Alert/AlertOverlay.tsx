import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useTheme } from '@/shared/hooks';
import { AppText } from '@/shared/components/atoms';
import {
  hideAlert,
  triggerAlertButtonCallback,
  SerializableAlertButton,
} from '@/shared/lib/alert';
import { commonStyles, palette, ms } from '@/shared/theme';

export const AlertOverlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const alertState = useAppSelector(state => state.alert);

  const visible = alertState?.visible ?? false;
  const title = alertState?.title;
  const message = alertState?.message ?? '';
  const buttons: SerializableAlertButton[] = alertState?.buttons ?? [];

  if (!visible) {
    return null;
  }

  const handleButtonPress = (index: number) => {
    dispatch(hideAlert());
    triggerAlertButtonCallback(index);
  };

  const isTwoButtons = buttons.length === 2;

  const getButtonTextColor = (button: SerializableAlertButton) => {
    if (button.style === 'destructive') {
      return theme.colors.error;
    }
    if (button.style === 'cancel') {
      return theme.colors.textSecondary;
    }
    return theme.colors.actionPrimary;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        dispatch(hideAlert());
      }}
    >
      <View
        style={[
          commonStyles.centerFlex,
          { backgroundColor: theme.colors.backdropOverlay },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.dialogBg,
              shadowColor: palette.black,
            },
          ]}
        >
          {/* Header & Body */}
          <View style={styles.content}>
            {title ? (
              <AppText
                variant="body"
                weight="bold"
                color={theme.colors.textPrimary}
                style={styles.title}
              >
                {title}
              </AppText>
            ) : null}

            {message ? (
              <AppText
                variant="caption"
                color={theme.colors.textSecondary}
                style={[styles.message, !title && styles.messageWithoutTitle]}
              >
                {message}
              </AppText>
            ) : null}
          </View>

          {/* Divider */}
          <View
            style={[styles.divider, { backgroundColor: theme.colors.divider }]}
          />

          {/* Action Buttons */}
          {isTwoButtons ? (
            <View style={styles.twoButtonRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, styles.flexButton]}
                onPress={() => handleButtonPress(0)}
              >
                <AppText
                  variant="body"
                  weight={buttons[0].style === 'cancel' ? 'regular' : 'bold'}
                  color={getButtonTextColor(buttons[0])}
                  style={styles.buttonText}
                >
                  {buttons[0].text}
                </AppText>
              </TouchableOpacity>

              <View
                style={[
                  styles.verticalDivider,
                  { backgroundColor: theme.colors.divider },
                ]}
              />

              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, styles.flexButton]}
                onPress={() => handleButtonPress(1)}
              >
                <AppText
                  variant="body"
                  weight={buttons[1].style === 'cancel' ? 'regular' : 'bold'}
                  color={getButtonTextColor(buttons[1])}
                  style={styles.buttonText}
                >
                  {buttons[1].text}
                </AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonColumn}>
              {buttons.map((btn, index) => (
                <React.Fragment key={btn.text + index}>
                  {index > 0 ? (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.colors.divider },
                      ]}
                    />
                  ) : null}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.button}
                    onPress={() => handleButtonPress(index)}
                  >
                    <AppText
                      variant="body"
                      weight={btn.style === 'cancel' ? 'regular' : 'bold'}
                      color={getButtonTextColor(btn)}
                      style={styles.buttonText}
                    >
                      {btn.text}
                    </AppText>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    width: Math.min(SCREEN_WIDTH * 0.76, ms(280)),
    borderRadius: ms(16),
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  content: {
    paddingTop: ms(22),
    paddingHorizontal: ms(20),
    paddingBottom: ms(18),
    alignItems: 'center',
  },
  title: {
    fontSize: ms(16.5),
    textAlign: 'center',
    marginBottom: ms(8),
    letterSpacing: -0.2,
  },
  message: {
    fontSize: ms(13),
    textAlign: 'center',
    lineHeight: ms(18),
    letterSpacing: -0.1,
  },
  messageWithoutTitle: {
    marginTop: ms(4),
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  verticalDivider: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
  },
  button: {
    height: ms(46),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexButton: {
    flex: 1,
  },
  twoButtonRow: {
    flexDirection: 'row',
    height: ms(46),
  },
  buttonColumn: {
    width: '100%',
  },
  buttonText: {
    fontSize: ms(14),
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
