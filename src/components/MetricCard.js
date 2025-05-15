import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import Card from './Card';

const MetricCard = ({
  title,
  value,
  icon,
  iconColor = COLORS.primary,
  unit = '',
  trend,
  trendValue,
}) => {
  // Determine trend color
  let trendColor = COLORS.textLight;
  if (trend === 'up') {
    trendColor = COLORS.success;
  } else if (trend === 'down') {
    trendColor = COLORS.error;
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      
      {trend && trendValue ? (
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'remove'} 
            size={16} 
            color={trendColor} 
          />
          <Text style={[styles.trendValue, { color: trendColor }]}>
            {trendValue}
          </Text>
        </View>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin.sm,
  },
  title: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: SIZES.margin.sm,
  },
  value: {
    ...FONTS.bold,
    fontSize: 28,
    color: COLORS.text,
  },
  unit: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: 4,
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.margin.xs,
  },
  trendValue: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    marginLeft: 4,
  },
});

export default MetricCard; 