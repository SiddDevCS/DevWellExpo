import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useActivity } from '../contexts/ActivityContext';

const DashboardScreen = () => {
  // Initialize state with default values
  const [metrics, setMetrics] = useState({
    stepCount: 0,
    sedentaryTime: 0,
    focusTime: 0,
    stressLevel: 0,
    wellnessScore: 75,
    breaks: []
  });
  
  const { 
    stepCount, 
    sedentaryTime, 
    focusTime, 
    stressLevel, 
    wellnessScore,
    breaks,
    startBreak,
  } = useActivity() || {};
  
  // Update metrics when activity data is loaded
  useEffect(() => {
    setMetrics({
      stepCount: stepCount || 0,
      sedentaryTime: sedentaryTime || 0,
      focusTime: focusTime || 0,
      stressLevel: stressLevel || 0,
      wellnessScore: wellnessScore || 75,
      breaks: breaks || []
    });
  }, [stepCount, sedentaryTime, focusTime, stressLevel, wellnessScore, breaks]);
  
  // Convert to display values
  const displaySedentaryTime = metrics.sedentaryTime.toFixed(1);
  const displayFocusTime = metrics.focusTime.toFixed(1);
  
  // Suggest break based on focus time
  const needsBreak = metrics.focusTime > 1.5; // 90 minutes of focus
  
  const handleStartBreak = () => {
    // Navigate to break selection
    if (startBreak) {
      startBreak('quick_stretch', 5);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScreenHeader title="Dashboard" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Date banner */}
        <Text style={styles.dateText}>
          {format(new Date(), 'EEEE, MMMM do')}
        </Text>
        
        {/* Wellness Score */}
        <Card style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Wellness Score</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{metrics.wellnessScore}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          
          {/* Score bar */}
          <View style={styles.scoreBarContainer}>
            <View 
              style={[
                styles.scoreBar, 
                { width: `${metrics.wellnessScore}%` }
              ]} 
            />
          </View>
        </Card>
        
        {/* Break recommendation */}
        {needsBreak && (
          <Card style={styles.breakCard}>
            <View style={styles.breakContent}>
              <Text style={styles.breakTitle}>
                Time for a break
              </Text>
              <Text style={styles.breakMessage}>
                You've been focusing for {displayFocusTime} hours. Taking a short break can improve productivity.
              </Text>
            </View>
            <Button 
              title="Take a Break" 
              onPress={handleStartBreak}
              icon="timer-outline"
            />
          </Card>
        )}
        
        {/* Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricColumn}>
            <MetricCard
              title="Steps"
              value={metrics.stepCount}
              icon="footsteps"
              iconColor={COLORS.tertiary}
              trend="up"
              trendValue="+2,345 today"
            />
            
            <MetricCard
              title="Focus Time"
              value={displayFocusTime}
              unit="hrs"
              icon="hourglass"
              iconColor={COLORS.primary}
            />
          </View>
          
          <View style={styles.metricColumn}>
            <MetricCard
              title="Sedentary Time"
              value={displaySedentaryTime}
              unit="hrs"
              icon="body"
              iconColor={metrics.sedentaryTime > 3 ? COLORS.error : COLORS.warning}
              trend={metrics.sedentaryTime > 3 ? "up" : null}
              trendValue={metrics.sedentaryTime > 3 ? "Too much sitting" : null}
            />
            
            <MetricCard
              title="Stress Level"
              value={metrics.stressLevel}
              unit="/10"
              icon="pulse"
              iconColor={metrics.stressLevel > 6 ? COLORS.error : COLORS.secondary}
            />
          </View>
        </View>
        
        {/* Today's breaks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Breaks</Text>
        </View>
        
        {metrics.breaks.length > 0 ? (
          <Card>
            {metrics.breaks.slice(0, 3).map((breakItem) => (
              <View key={breakItem.id} style={styles.breakHistoryItem}>
                <View style={styles.breakHistoryLeft}>
                  <Text style={styles.breakHistoryType}>{breakItem.type}</Text>
                  <Text style={styles.breakHistoryTime}>
                    {format(new Date(breakItem.startTime), 'h:mm a')}
                  </Text>
                </View>
                <Text style={styles.breakHistoryDuration}>
                  {breakItem.duration} min
                </Text>
              </View>
            ))}
            
            {metrics.breaks.length > 3 && (
              <Text style={styles.viewMoreText}>
                +{metrics.breaks.length - 3} more breaks today
              </Text>
            )}
          </Card>
        ) : (
          <Card>
            <Text style={styles.noBreaksText}>
              No breaks taken today. Remember to rest regularly.
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding.lg,
    paddingBottom: 20,
  },
  dateText: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginVertical: SIZES.margin.md,
  },
  scoreCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.margin.md,
  },
  scoreTitle: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.card,
    opacity: 0.8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: SIZES.margin.xs,
  },
  scoreValue: {
    ...FONTS.bold,
    fontSize: 44,
    color: COLORS.card,
  },
  scoreMax: {
    ...FONTS.medium,
    fontSize: SIZES.lg,
    color: COLORS.card,
    opacity: 0.8,
    marginBottom: 8,
    marginLeft: 2,
  },
  scoreBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginTop: SIZES.margin.md,
  },
  scoreBar: {
    height: 8,
    backgroundColor: COLORS.card,
    borderRadius: 4,
  },
  breakCard: {
    backgroundColor: COLORS.secondary,
    marginBottom: SIZES.margin.md,
  },
  breakContent: {
    marginBottom: SIZES.margin.md,
  },
  breakTitle: {
    ...FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.card,
    marginBottom: SIZES.margin.xs,
  },
  breakMessage: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.card,
    opacity: 0.9,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricColumn: {
    width: '48%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.margin.lg,
    marginBottom: SIZES.margin.sm,
  },
  sectionTitle: {
    ...FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.text,
  },
  breakHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  breakHistoryLeft: {
    flex: 1,
  },
  breakHistoryType: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  breakHistoryTime: {
    ...FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  breakHistoryDuration: {
    ...FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  viewMoreText: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.margin.sm,
  },
  noBreaksText: {
    ...FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SIZES.padding.md,
  },
});

export default DashboardScreen; 