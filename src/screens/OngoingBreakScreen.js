import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';
import { useActivity } from '../contexts/ActivityContext';

const OngoingBreakScreen = ({ route, navigation: navigationProp }) => {
  const defaultNavigation = useNavigation();
  const router = useRouter();
  const navigation = navigationProp || defaultNavigation;
  
  const { breakId, breakType } = route?.params || {};
  const { completeBreak } = useActivity();
  
  const [timeLeft, setTimeLeft] = useState(breakType?.duration * 60 || 300); // seconds
  const [isActive, setIsActive] = useState(true);
  const [moodRating, setMoodRating] = useState(7);
  const [breakCompleted, setBreakCompleted] = useState(false);
  
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(null);
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !breakCompleted) {
      setIsActive(false);
      setBreakCompleted(true);
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);
  
  // Start the progress animation
  useEffect(() => {
    const totalDuration = breakType?.duration * 60 || 300;
    
    progressAnimation.current = Animated.timing(animatedValue, {
      toValue: 1,
      duration: totalDuration * 1000,
      useNativeDriver: false,
    });
    
    if (isActive) {
      progressAnimation.current.start();
    } else {
      progressAnimation.current.stop();
    }
    
    return () => {
      if (progressAnimation.current) {
        progressAnimation.current.stop();
      }
    };
  }, [isActive]);
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle pause/resume
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  // Handle end break early
  const handleEndBreak = () => {
    setIsActive(false);
    setBreakCompleted(true);
  };
  
  // Handle mood rating
  const handleMoodSelect = (rating) => {
    setMoodRating(rating);
  };
  
  // Handle navigation back
  const handleGoBack = () => {
    if (navigation.goBack) {
      navigation.goBack();
    } else {
      router.back();
    }
  };
  
  // Handle complete break
  const handleComplete = () => {
    completeBreak(breakId, moodRating);
    handleGoBack();
  };
  
  // Progress circle calculation
  const circleSize = 220;
  const strokeWidth = 15;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
    extrapolate: 'clamp',
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleGoBack}
        >
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {!breakCompleted ? (
          <>
            <Text style={styles.breakName}>
              {breakType?.name || 'Taking a Break'}
            </Text>
            
            <View style={styles.timerContainer}>
              <Animated.View style={styles.progressCircle}>
                <Animated.View style={styles.progressBackground} />
                <Animated.View
                  style={[
                    styles.progressForeground,
                    {
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.progressCircleContainer,
                      {
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                      },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.progressCircleMask,
                        {
                          width: circleSize,
                          height: circleSize,
                          borderRadius: circleSize / 2,
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.progressCircleFill,
                        {
                          width: circleSize,
                          height: circleSize,
                          borderRadius: circleSize / 2,
                          backgroundColor: COLORS.primary,
                        },
                      ]}
                    />
                  </Animated.View>
                </Animated.View>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </Animated.View>
            </View>
            
            <View style={styles.controlsContainer}>
              <Button
                title={isActive ? "Pause" : "Resume"}
                onPress={toggleTimer}
                icon={isActive ? "pause" : "play"}
                style={styles.controlButton}
              />
              
              <Button
                title="End Break"
                onPress={handleEndBreak}
                variant="outlined"
                style={styles.controlButton}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.completedTitle}>Break Completed</Text>
            <Text style={styles.completedSubtitle}>How do you feel now?</Text>
            
            <Card style={styles.moodCard}>
              <View style={styles.moodRating}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.moodButton,
                      rating === moodRating && styles.selectedMoodButton,
                    ]}
                    onPress={() => handleMoodSelect(rating)}
                  >
                    <Text style={[
                      styles.moodButtonText,
                      rating === moodRating && styles.selectedMoodButtonText,
                    ]}>
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.moodLabels}>
                <Text style={styles.moodLabel}>Not great</Text>
                <Text style={styles.moodLabel}>Excellent</Text>
              </View>
            </Card>
            
            <Button
              title="Complete Break"
              onPress={handleComplete}
              size="large"
              style={styles.completeButton}
            />
          </>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.padding.lg,
    paddingTop: 50,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.lg,
  },
  breakName: {
    ...FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressCircle: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 110,
    borderWidth: 15,
    borderColor: `${COLORS.primary}20`,
  },
  progressForeground: {
    position: 'absolute',
    overflow: 'hidden',
  },
  progressCircleContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  progressCircleMask: {
    position: 'absolute',
    borderWidth: 15,
    borderColor: COLORS.primary,
  },
  progressCircleFill: {
    position: 'absolute',
  },
  timerText: {
    ...FONTS.bold,
    fontSize: 44,
    color: COLORS.text,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  controlButton: {
    width: 140,
    marginHorizontal: 10,
  },
  completedTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.text,
    textAlign: 'center',
  },
  completedSubtitle: {
    ...FONTS.medium,
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 30,
  },
  moodCard: {
    width: '100%',
    marginBottom: 40,
  },
  moodRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moodButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMoodButton: {
    backgroundColor: COLORS.primary,
  },
  moodButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  selectedMoodButtonText: {
    color: COLORS.card,
  },
  moodLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  moodLabel: {
    ...FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  completeButton: {
    width: '100%',
  },
});

export default OngoingBreakScreen; 