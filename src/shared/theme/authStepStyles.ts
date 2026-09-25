import { StyleSheet } from 'react-native';
import { ms } from './scaling';

export const authStepStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: ms(22),
    lineHeight: ms(28),
    marginBottom: ms(8),
  },
  subtitle: {
    fontSize: ms(14),
    lineHeight: ms(20),
  },
});
