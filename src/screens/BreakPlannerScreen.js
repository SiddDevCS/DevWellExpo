import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import { BREAK_TYPES, COLORS, FONTS, SIZES } from '../constants/theme';
import { useActivity } from '../contexts/ActivityContext';

const BreakPlannerScreen = ({ navigation: navigationProp }) => {
  const defaultNavigation = useNavigation();
  const navigation = navigationProp || defaultNavigation;
  const { startBreak } = useActivity();
  
  const handleSelectBreak = (breakType) => {
    const breakId = startBreak(breakType.id, breakType.duration);
    navigation.navigate('OngoingBreak', { breakId, breakType });
  };
  
  const renderBreakItem = ({ item }) => (
    <Card 
      style={styles.breakCard}
      onPress={() => handleSelectBreak(item)}
    >
      <View style={styles.breakHeader}>
        <Text style={styles.breakIcon}>{item.icon}</Text>
        <View style={styles.breakInfo}>
          <Text style={styles.breakName}>{item.name}</Text>
          <Text style={styles.breakDuration}>{item.duration} min</Text>
        </View>
      </View>
      <Text style={styles.breakDescription}>{item.description}</Text>
      <Button 
        title="Start Break" 
        style={styles.startButton}
        size="small"
        icon="play"
        iconPosition="right"
        onPress={() => handleSelectBreak(item)}
      />
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <ScreenHeader title="Break Planner" />
      
      <View style={styles.contentContainer}>
        <Text style={styles.introText}>
          Taking regular breaks helps maintain productivity and wellness.
          Choose a break type to get started:
        </Text>
        
        <FlatList
          data={BREAK_TYPES}
          renderItem={renderBreakItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding.lg,
  },
  introText: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SIZES.margin.lg,
  },
  listContent: {
    paddingBottom: SIZES.padding.xl,
  },
  breakCard: {
    marginBottom: SIZES.margin.md,
  },
  breakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin.sm,
  },
  breakIcon: {
    fontSize: 24,
    marginRight: SIZES.margin.md,
  },
  breakInfo: {
    flex: 1,
  },
  breakName: {
    ...FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.text,
  },
  breakDuration: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },
  breakDescription: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SIZES.margin.md,
  },
  startButton: {
    alignSelf: 'flex-end',
  },
});

export default BreakPlannerScreen; 