import { format } from 'date-fns';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Card from '../components/Card';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useActivity } from '../contexts/ActivityContext';

const BreakHistoryScreen = () => {
  const { breaks } = useActivity();
  
  // Sort breaks by date (most recent first)
  const sortedBreaks = [...breaks].sort((a, b) => 
    new Date(b.startTime) - new Date(a.startTime)
  );
  
  const renderBreakItem = ({ item }) => {
    const startTime = new Date(item.startTime);
    const formattedDate = format(startTime, 'MMM d, yyyy');
    const formattedTime = format(startTime, 'h:mm a');
    
    return (
      <Card style={styles.breakCard}>
        <View style={styles.breakHeader}>
          <View>
            <Text style={styles.breakType}>{item.type}</Text>
            <Text style={styles.breakDate}>{formattedDate} at {formattedTime}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.durationValue}>{item.duration}</Text>
            <Text style={styles.durationUnit}>min</Text>
          </View>
        </View>
        
        {item.moodAfter && (
          <View style={styles.moodContainer}>
            <Text style={styles.moodLabel}>Mood after:</Text>
            <Text style={styles.moodValue}>
              {item.moodAfter > 7 ? '😀' : item.moodAfter > 4 ? '🙂' : '😐'}
              {' '}({item.moodAfter}/10)
            </Text>
          </View>
        )}
      </Card>
    );
  };
  
  return (
    <View style={styles.container}>
      <ScreenHeader title="Break History" />
      
      <View style={styles.contentContainer}>
        {sortedBreaks.length > 0 ? (
          <FlatList
            data={sortedBreaks}
            renderItem={renderBreakItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't taken any breaks yet.
            </Text>
            <Text style={styles.emptySubtext}>
              Regular breaks help improve your wellness score and productivity.
            </Text>
          </View>
        )}
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
  listContent: {
    paddingBottom: SIZES.padding.xl,
  },
  breakCard: {
    marginBottom: SIZES.margin.md,
  },
  breakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  breakType: {
    ...FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.text,
  },
  breakDate: {
    ...FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  durationValue: {
    ...FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
  },
  durationUnit: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginLeft: 2,
    marginBottom: 2,
  },
  moodContainer: {
    flexDirection: 'row',
    marginTop: SIZES.margin.md,
    paddingTop: SIZES.padding.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  moodLabel: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginRight: SIZES.margin.sm,
  },
  moodValue: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.lg,
  },
  emptyText: {
    ...FONTS.medium,
    fontSize: SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.margin.sm,
  },
  emptySubtext: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default BreakHistoryScreen; 