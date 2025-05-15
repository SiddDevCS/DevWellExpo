import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'filled', // filled, outlined, text
  size = 'medium', // small, medium, large
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  hapticFeedback = true,
  hapticType = 'medium', // light, medium, heavy, selection, success, warning, error
}) => {
  // Determine container style based on variant
  const getContainerStyle = () => {
    if (variant === 'filled') {
      return [
        styles.container,
        styles[`${size}Container`],
        { backgroundColor: disabled ? COLORS.inactive : COLORS.primary },
        style,
      ];
    } else if (variant === 'outlined') {
      return [
        styles.container,
        styles.outlinedContainer,
        styles[`${size}Container`],
        { borderColor: disabled ? COLORS.inactive : COLORS.primary },
        style,
      ];
    } else {
      return [
        styles.container,
        styles.textContainer,
        styles[`${size}Container`],
        style,
      ];
    }
  };

  // Determine text style based on variant
  const getTextStyle = () => {
    if (variant === 'filled') {
      return [
        styles.text,
        styles[`${size}Text`],
        { color: COLORS.card },
        textStyle,
      ];
    } else {
      return [
        styles.text,
        styles[`${size}Text`],
        { color: disabled ? COLORS.inactive : COLORS.primary },
        textStyle,
      ];
    }
  };
  
  // Handle haptic feedback
  const handlePress = () => {
    if (hapticFeedback && !disabled && !loading) {
      switch (hapticType) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'selection':
          Haptics.selectionAsync();
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'filled' ? COLORS.card : COLORS.primary} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : size === 'medium' ? 18 : 20}
              color={variant === 'filled' ? COLORS.card : COLORS.primary}
              style={styles.leftIcon}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : size === 'medium' ? 18 : 20}
              color={variant === 'filled' ? COLORS.card : COLORS.primary}
              style={styles.rightIcon}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius.md,
  },
  outlinedContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  textContainer: {
    backgroundColor: 'transparent',
  },
  smallContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mediumContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  largeContainer: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  text: {
    ...FONTS.medium,
    textAlign: 'center',
  },
  smallText: {
    fontSize: SIZES.sm,
  },
  mediumText: {
    fontSize: SIZES.md,
  },
  largeText: {
    fontSize: SIZES.lg,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button; 