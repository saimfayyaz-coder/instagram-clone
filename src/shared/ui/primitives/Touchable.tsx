import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export type TouchableProps = TouchableOpacityProps;

// The app's tappable primitive. Use it instead of importing TouchableOpacity or
// Pressable directly, so press feedback can be changed app-wide in one place.
export const Touchable: React.FC<TouchableProps> = props => <TouchableOpacity {...props} />;
