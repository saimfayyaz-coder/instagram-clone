import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
} from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';

export interface OtpCodeInputProps {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
}

export const OtpCodeInput: React.FC<OtpCodeInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
}) => {
  const { theme } = useTheme();
  const inputRefs = useRef<Array<any>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const handleChangeText = (text: string, index: number) => {
    if (disabled) return;

    // Handle full paste
    const cleanText = text.replace(/[^0-9]/g, '');
    if (cleanText.length > 1) {
      const pastedDigits = cleanText.slice(0, length);
      onChange(pastedDigits);
      const nextFocus = Math.min(pastedDigits.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const singleDigit = cleanText.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    const newCode = newDigits.join('');
    onChange(newCode);

    if (singleDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<{ key: string }>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      {digits.map((digit, index) => {
        const isFocused = focusedIndex === index;
        return (
          <TextInput
            key={`otp-box-${index}`}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            keyboardType="number-pad"
            maxLength={index === 0 ? length : 1}
            editable={!disabled}
            selectTextOnFocus
            textAlign="center"
            style={[
              styles.box,
              {
                backgroundColor: theme.colors.surface,
                borderColor: hasError
                  ? theme.colors.error
                  : isFocused
                  ? theme.colors.borderFocus
                  : theme.colors.border,
                color: theme.colors.textPrimary,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: ms(20),
    gap: ms(8),
  },
  box: {
    width: ms(44),
    height: ms(50),
    borderRadius: ms(8),
    borderWidth: 1.5,
    fontSize: ms(22),
    fontWeight: '700',
    padding: 0,
  },
});
