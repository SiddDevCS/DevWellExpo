import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';

const Card = ({
  children,
  style,
  onPress,
  shadowLevel = 'small',
  backgroundColor = COLORS.card,
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        SHADOWS[shadowLevel],
        { backgroundColor },
        style,
      ]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius.md,
    padding: SIZES.padding.md,
    marginVertical: SIZES.margin.sm,
  },
});

export default Card; 