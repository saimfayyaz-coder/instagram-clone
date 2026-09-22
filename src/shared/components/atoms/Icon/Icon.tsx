import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import R from '@/shared/theme';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export type IconType =
  | 'Ionicons'
  | 'MaterialIcons'
  | 'FontAwesome'
  | 'Entypo'
  | 'AntDesign'
  | 'Feather'
  | 'EvilIcons'
  | 'MaterialCommunityIcons'
  | 'SimpleLineIcons'
  | 'Octicons'
  | 'Zocial'
  | 'Foundation'
  | 'FontAwesome5'
  | 'Fontisto';

export interface IIconProps {
  name: string;
  type: IconType;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const iconMap = {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Entypo,
  AntDesign,
  Feather,
  EvilIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
  Octicons,
  Zocial,
  Foundation,
  FontAwesome5,
  Fontisto,
};

export const Icon = ({
  name,
  type,
  size = 16,
  color = 'black',
  style,
  onPress,
}: IIconProps) => {
  const VectorIcon = iconMap[type];

  if (!VectorIcon) return null;

  return (
    <VectorIcon
      name={name}
      size={R.unit.scale(size)}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default Icon;
