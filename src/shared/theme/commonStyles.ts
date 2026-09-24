import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  fullWidth: {
    width: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignCenter: {
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
