import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import Button from '../components/Button';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

// Progress Bar Component with Animation
const OnboardingProgressBar = ({ currentStep, totalSteps, showSlideProgress }) => {
  // Animation value for progress bar fill
  const animatedWidth = useRef(new Animated.Value(0)).current;
  
  // Calculate the percentage of completion
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  
  useEffect(() => {
    // Animate the progress bar fill
    Animated.timing(animatedWidth, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
    
    // Add a subtle haptic feedback when progress changes
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [currentStep, totalSteps]);
  
  // Interpolate the animated value to create a width percentage
  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <Animated.View 
          style={[
            styles.progressBarFill, 
            { width }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        {showSlideProgress ? 
          `Slide ${currentStep + 1} of ${totalSteps}` : 
          `Step ${currentStep + 1} of ${totalSteps}`
        }
      </Text>
    </View>
  );
};

// Enhanced SVG components with animations
const WelcomeImage = () => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  return (
    <Animated.View style={{
      opacity: opacityAnim,
      transform: [{ scale: scaleAnim }]
    }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill={COLORS.primary} />
        <Circle cx="100" cy="70" r="30" fill={COLORS.background} />
        <Path
          d="M50,140 C50,110 150,110 150,140 C150,170 50,170 50,140 Z"
          fill={COLORS.background}
        />
      </Svg>
    </Animated.View>
  );
};

const ActivityImage = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);
  
  return (
    <Animated.View style={{
      transform: [{ scale: pulseAnim }]
    }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Rect x="40" y="40" width="120" height="120" rx="10" fill={COLORS.primary} />
        <Path
          d="M60,100 L80,120 L140,60"
          stroke={COLORS.background}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
};

const BreaksImage = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <Animated.View style={{
      transform: [{ rotate }]
    }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill={COLORS.primary} />
        <Path
          d="M100,50 L100,100 L130,120"
          stroke={COLORS.background}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
};

const GoalsImage = () => {
  const innerCircleAnim = useRef(new Animated.Value(0)).current;
  const middleCircleAnim = useRef(new Animated.Value(0)).current;
  const outerCircleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(innerCircleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(middleCircleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(outerCircleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  return (
    <Svg height="220" width="220" viewBox="0 0 200 200">
      <G>
        <AnimatedCircle 
          cx="100" 
          cy="100" 
          r="30" 
          fill={COLORS.primary}
          style={{ opacity: innerCircleAnim }}
        />
        <AnimatedCircle 
          cx="100" 
          cy="100" 
          r="50" 
          fill="none" 
          stroke={COLORS.primary} 
          strokeWidth="5"
          style={{ opacity: middleCircleAnim }}
        />
        <AnimatedCircle 
          cx="100" 
          cy="100" 
          r="70" 
          fill="none" 
          stroke={COLORS.primary} 
          strokeWidth="5"
          style={{ opacity: outerCircleAnim }}
        />
      </G>
    </Svg>
  );
};

// Animated Circle component for SVG
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Progress dots component
const Paginator = ({ data, scrollX }) => {
  return (
    <View style={styles.paginatorContainer}>
      {data.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 30, 10],
          extrapolate: 'clamp'
        });
        
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp'
        });
        
        return (
          <Animated.View 
            key={index.toString()} 
            style={[
              styles.dot, 
              { 
                width: dotWidth,
                opacity
              }
            ]} 
          />
        );
      })}
    </View>
  );
};

// Custom slide component with animations
const OnboardingSlide = ({ item }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        {item.image}
      </View>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
};

const MainOnboardingScreen = () => {
  const { currentUser, completeOnboarding } = useAuth();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  
  // Define all steps of the onboarding process in one array
  const TOTAL_STEPS = 8;
  
  // Onboarding data with improved messaging
  const introSlides = [
    {
      id: 'welcome',
      title: "Welcome to DevWell",
      subtitle: "Let's personalize your experience for a healthier coding lifestyle",
      image: <WelcomeImage />
    },
    {
      id: 'activity',
      title: "Coding Without Compromise",
      subtitle: "Track your activity patterns to prevent burnout while staying productive",
      image: <ActivityImage />
    },
    {
      id: 'breaks',
      title: "Breaks Designed for You",
      subtitle: "Smart, personalized breaks that fit your workflow and prevent strain",
      image: <BreaksImage />
    },
    {
      id: 'goals',
      title: "Your Developer Wellness Journey",
      subtitle: "Set goals that matter to you and build healthy habits that last",
      image: <GoalsImage />
    }
  ];
  
  const [userData, setUserData] = useState({
    // Default values for personalization screens
    developerType: 'full_stack',
    experience: '3_5_years',
    workStyle: 'hybrid',
    dailyStepGoal: 8000,
    painPoints: ['sedentary', 'eye_strain'],
    breakPreference: 'medium',
    workStartTime: '9 AM',
    workEndTime: '5 PM',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  });
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Method to update user data
  const updateUserData = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
  };
  
  // Handle next step
  const handleNextStep = useCallback(() => {
    if (currentStep >= TOTAL_STEPS - 1) {
      // We've reached the end of onboarding
      return;
    }
    
    // Animate out current content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Increment step
      setCurrentStep(prevStep => prevStep + 1);
      
      // Reset animations for next content
      slideAnim.setValue(30);
      
      // If we're transitioning to intro slides, update the FlatList
      if (currentStep < introSlides.length - 1 && currentStep + 1 < introSlides.length) {
        slidesRef.current?.scrollToIndex({ 
          index: currentStep + 1, 
          animated: false 
        });
      }
      
      // Animate in new content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    });
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [currentStep, fadeAnim, slideAnim]);
  
  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Login');
  }, [navigation]);
  
  const handleRegisterPrompt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('SignUp', { onboardingData: userData });
  };
  
  const handleOnboardingComplete = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (currentUser) {
        await completeOnboarding(currentUser.uid, userData);
        navigation.navigate('Main');
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };
  
  // Handle scroll events for intro slides
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        if (slideIndex !== currentStep && slideIndex >= 0 && slideIndex < introSlides.length) {
          setCurrentStep(slideIndex);
        }
      }
    }
  );
  
  // Custom button component for each step
  const NextButton = () => {
    const getButtonTitle = () => {
      if (currentStep === introSlides.length - 1) return "Let's Begin";
      if (currentStep === TOTAL_STEPS - 1) return "Finish";
      return "Next";
    };
    
    const getButtonIcon = () => {
      if (currentStep === introSlides.length - 1) return "arrow-forward-outline";
      if (currentStep === TOTAL_STEPS - 1) return "checkmark-outline";
      return null;
    };
    
    const handlePress = () => {
      if (currentStep === TOTAL_STEPS - 1) {
        handleRegisterPrompt();
      } else {
        handleNextStep();
      }
    };
    
    return (
      <Button 
        title={getButtonTitle()} 
        onPress={handlePress}
        style={styles.nextButton}
        icon={getButtonIcon()}
        iconPosition="right"
        hapticType={
          currentStep === introSlides.length - 1 || 
          currentStep === TOTAL_STEPS - 1 ? "medium" : "light"
        }
      />
    );
  };
  
  // Render the current step based on the step index
  const renderCurrentStep = () => {
    // For intro slides (steps 0-3)
    if (currentStep < introSlides.length) {
      return (
        <Animated.View
          style={[
            styles.slideContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <FlatList
            data={introSlides}
            renderItem={({ item }) => <OnboardingSlide item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialScrollIndex={currentStep}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            ref={slidesRef}
            scrollEnabled={false} // Disable manual scrolling for consistent experience
          />
          
          <Paginator data={introSlides} scrollX={scrollX} />
        </Animated.View>
      );
    }
    
    // For personalization screens (steps 4-7)
    switch (currentStep) {
      case 4: // Developer Profile
        return (
          <Animated.View 
            style={[
              styles.personalizeContent, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.personalizeTitle}>Tell us about yourself</Text>
            <Text style={styles.personalizeSubtitle}>
              This helps us tailor DevWell to your unique needs
            </Text>
            
            <DeveloperProfileContent 
              userData={userData}
              updateUserData={updateUserData}
            />
          </Animated.View>
        );
        
      case 5: // Wellness Goals
        return (
          <Animated.View 
            style={[
              styles.personalizeContent, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.personalizeTitle}>Your Wellness Goals</Text>
            <Text style={styles.personalizeSubtitle}>
              Tell us what matters to you for a healthier coding lifestyle
            </Text>
            
            <WellnessGoalsContent 
              userData={userData}
              updateUserData={updateUserData}
            />
          </Animated.View>
        );
        
      case 6: // Work Schedule
        return (
          <Animated.View 
            style={[
              styles.personalizeContent, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.personalizeTitle}>Your Work Schedule</Text>
            <Text style={styles.personalizeSubtitle}>
              This helps us schedule breaks at the right times
            </Text>
            
            <WorkScheduleContent 
              userData={userData}
              updateUserData={updateUserData}
            />
          </Animated.View>
        );
        
      case 7: // Registration Prompt
        return (
          <Animated.View 
            style={[
              styles.personalizeContent, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.personalizeTitle}>Just One Final Step</Text>
            <Text style={styles.personalizeSubtitle}>
              Create an account to save your preferences and track your progress
            </Text>
            
            <View style={styles.registerButtonsContainer}>
              <Button 
                title="Create Account" 
                onPress={handleRegisterPrompt}
                style={styles.registerButton}
                icon="person-add-outline"
                iconPosition="left"
              />
              
              <Button 
                title="I already have an account" 
                onPress={handleRegisterPrompt}
                style={styles.loginButton}
                variant="outlined"
              />
              
              <TouchableOpacity
                style={styles.skipRegisterButton}
                onPress={handleOnboardingComplete}
              >
                <Text style={styles.skipRegisterText}>
                  Skip for now
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button for intro slides only */}
      {currentStep < introSlides.length && (
        <View style={styles.skipContainer}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Unified progress bar */}
      <View style={styles.progressContainer}>
        <OnboardingProgressBar 
          currentStep={currentStep} 
          totalSteps={TOTAL_STEPS} 
          showSlideProgress={false}
        />
      </View>
      
      {/* Current step content */}
      {renderCurrentStep()}
      
      {/* Next button (always visible at bottom) */}
      <View style={styles.buttonContainer}>
        <NextButton />
      </View>
    </SafeAreaView>
  );
};

// Extract the content from each personalization screen into separate components
const DeveloperProfileContent = ({ userData, updateUserData }) => {
  const { developerType, experience, workStyle } = userData;
  
  return (
    <>
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>What type of developer are you?</Text>
        <View style={styles.goalSelectorWrap}>
          {[
            { value: 'frontend', label: 'Frontend' },
            { value: 'backend', label: 'Backend' },
            { value: 'full_stack', label: 'Full Stack' },
            { value: 'mobile', label: 'Mobile' },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.goalButtonWide,
                developerType === item.value && styles.goalButtonActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                updateUserData({ developerType: item.value });
              }}
            >
              <Text 
                style={[
                  styles.goalButtonText,
                  developerType === item.value && styles.goalButtonTextActive
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>Years of coding experience</Text>
        <View style={styles.goalSelector}>
          {[
            { value: '0_2_years', label: '0-2' },
            { value: '3_5_years', label: '3-5' },
            { value: '5_plus_years', label: '5+' }
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.goalButton,
                experience === item.value && styles.goalButtonActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                updateUserData({ experience: item.value });
              }}
            >
              <Text 
                style={[
                  styles.goalButtonText,
                  experience === item.value && styles.goalButtonTextActive
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>Where do you primarily work?</Text>
        <View style={styles.goalSelector}>
          {[
            { value: 'remote', label: 'Remote' },
            { value: 'office', label: 'Office' }, 
            { value: 'hybrid', label: 'Hybrid' }
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.goalButton,
                workStyle === item.value && styles.goalButtonActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                updateUserData({ workStyle: item.value });
              }}
            >
              <Text 
                style={[
                  styles.goalButtonText,
                  workStyle === item.value && styles.goalButtonTextActive
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};

const WellnessGoalsContent = ({ userData, updateUserData }) => {
  const { dailyStepGoal, painPoints, breakPreference } = userData;
  
  const togglePainPoint = (item) => {
    Haptics.selectionAsync();
    let newPainPoints;
    if (painPoints.includes(item)) {
      newPainPoints = painPoints.filter(i => i !== item);
    } else {
      newPainPoints = [...painPoints, item];
    }
    updateUserData({ painPoints: newPainPoints });
  };
  
  return (
    <>
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>Daily step target</Text>
        <View style={styles.goalSelector}>
          {[5000, 8000, 10000].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.goalButton,
                dailyStepGoal === value && styles.goalButtonActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                updateUserData({ dailyStepGoal: value });
              }}
            >
              <Text 
                style={[
                  styles.goalButtonText,
                  dailyStepGoal === value && styles.goalButtonTextActive
                ]}
              >
                {value.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>What are your main wellness concerns?</Text>
        <View style={styles.goalSelectorWrap}>
          {[
            { value: 'sedentary', label: 'Sitting too long' },
            { value: 'eye_strain', label: 'Eye strain' },
            { value: 'stress', label: 'Stress/Burnout' },
            { value: 'posture', label: 'Poor posture' },
            { value: 'hydration', label: 'Hydration' },
            { value: 'focus', label: 'Focus/Productivity' }
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.painPointButton,
                painPoints.includes(item.value) && styles.goalButtonActive
              ]}
              onPress={() => togglePainPoint(item.value)}
            >
              <Text 
                style={[
                  styles.goalButtonText,
                  painPoints.includes(item.value) && styles.goalButtonTextActive
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>How long do you prefer your breaks?</Text>
        <View style={styles.breakDurationSelector}>
          <TouchableOpacity
            style={[
              styles.breakDurationButton,
              breakPreference === 'short' && styles.goalButtonActive
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              updateUserData({ breakPreference: 'short' });
            }}
          >
            <Text 
              style={[
                styles.goalButtonText,
                breakPreference === 'short' && styles.goalButtonTextActive
              ]}
            >
              Short (2-3 min)
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.breakDurationButton,
              breakPreference === 'medium' && styles.goalButtonActive
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              updateUserData({ breakPreference: 'medium' });
            }}
          >
            <Text 
              style={[
                styles.goalButtonText,
                breakPreference === 'medium' && styles.goalButtonTextActive
              ]}
            >
              Medium (5 min)
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.breakDurationButton,
              breakPreference === 'long' && styles.goalButtonActive
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              updateUserData({ breakPreference: 'long' });
            }}
          >
            <Text 
              style={[
                styles.goalButtonText,
                breakPreference === 'long' && styles.goalButtonTextActive
              ]}
            >
              Long (10+ min)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const WorkScheduleContent = ({ userData, updateUserData }) => {
  const { workStartTime, workEndTime, workDays } = userData;
  
  const toggleWorkDay = (day) => {
    Haptics.selectionAsync();
    let newWorkDays;
    if (workDays.includes(day)) {
      newWorkDays = workDays.filter(d => d !== day);
    } else {
      newWorkDays = [...workDays, day];
    }
    updateUserData({ workDays: newWorkDays });
  };
  
  // Day abbreviations matching the screenshot format
  const dayAbbreviations = [
    { day: 'Mon', label: 'Mo\nn' },
    { day: 'Tue', label: 'Tu\ne' },
    { day: 'Wed', label: 'We\nd' },
    { day: 'Thu', label: 'Th\nu' },
    { day: 'Fri', label: 'Fri' },
    { day: 'Sat', label: 'Sa\nt' },
    { day: 'Sun', label: 'Su\nn' }
  ];
  
  return (
    <>
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>Work start time</Text>
        <View style={styles.goalSelector}>
          {['8 AM', '9 AM', '10 AM'].map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.goalButton,
                workStartTime === time && styles.goalButtonActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                updateUserData({ workStartTime: time });
              }}
            >
              <Text 
                style={[
                  styles.goalButtonText,
                  workStartTime === time && styles.goalButtonTextActive
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>Work end time</Text>
        <View style={styles.goalSelector}>
          {['4 PM', '5 PM', '6 PM'].map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.goalButton,
                workEndTime === time && styles.goalButtonActive
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                updateUserData({ workEndTime: time });
              }}
            >
              <Text 
                style={[
                  styles.goalButtonText,
                  workEndTime === time && styles.goalButtonTextActive
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.goalOption}>
        <Text style={styles.goalLabel}>Work days</Text>
        <View style={styles.daysContainer}>
          {dayAbbreviations.map((item) => (
            <TouchableOpacity
              key={item.day}
              style={[
                styles.dayButton,
                workDays.includes(item.day) && styles.dayButtonActive
              ]}
              onPress={() => toggleWorkDay(item.day)}
            >
              <Text 
                style={[
                  styles.dayButtonText,
                  workDays.includes(item.day) && styles.dayButtonTextActive
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  slide: {
    width,
    paddingHorizontal: SIZES.padding.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.35,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipButton: {
    padding: SIZES.padding.sm,
  },
  skipText: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginHorizontal: 8,
  },
  buttonContainer: {
    paddingHorizontal: SIZES.padding.lg,
    marginBottom: 40,
  },
  nextButton: {
    width: '100%',
    borderRadius: 100,
  },
  personalizeContainer: {
    flex: 1,
    padding: SIZES.padding.lg,
    justifyContent: 'center',
  },
  personalizeTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  personalizeSubtitle: {
    ...FONTS.regular,
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  goalOption: {
    marginBottom: 24,
  },
  goalLabel: {
    ...FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.text,
    marginBottom: 12,
  },
  goalSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalSelectorWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalButton: {
    backgroundColor: COLORS.card,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  goalButtonWide: {
    backgroundColor: COLORS.card,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 10,
  },
  goalButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  goalButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.text,
    textAlign: 'center',
  },
  goalButtonTextActive: {
    color: COLORS.background,
  },
  painPointButton: {
    backgroundColor: COLORS.card,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dayButton: {
    backgroundColor: COLORS.card,
    borderRadius: 100,
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 10,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.xs,
    textAlign: 'center',
    color: COLORS.text,
  },
  dayButtonTextActive: {
    color: COLORS.background,
  },
  breakDurationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  breakDurationButton: {
    backgroundColor: COLORS.card,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  registerButtonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerButton: {
    width: '100%',
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    marginBottom: 24,
  },
  skipRegisterButton: {
    padding: 10,
  },
  skipRegisterText: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: COLORS.card,
    borderRadius: 5,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(184, 242, 201, 0.3)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  progressText: {
    ...FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    paddingHorizontal: SIZES.padding.lg,
    marginTop: 40,
    marginBottom: 15,
    zIndex: 5,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalizeContent: {
    flex: 1,
    padding: SIZES.padding.lg,
    paddingTop: 0,
  },
});

export default MainOnboardingScreen; 