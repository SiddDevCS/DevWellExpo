import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const Logo = ({ size = 100, color = COLORS.primary }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg height={size} width={size} viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill={color} />
        <Path
          d="M65,130 L135,130 C145,130 150,125 150,115 L150,85 C150,75 145,70 135,70 L65,70 C55,70 50,75 50,85 L50,115 C50,125 55,130 65,130 Z"
          fill={COLORS.background}
        />
        <Rect x="70" y="85" width="20" height="30" rx="2" fill={color} />
        <Rect x="110" y="85" width="20" height="30" rx="2" fill={color} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Logo; 