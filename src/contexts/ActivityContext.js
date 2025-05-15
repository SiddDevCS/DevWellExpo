import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInMinutes } from 'date-fns';
import { Accelerometer, Pedometer } from 'expo-sensors';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ActivityContext = createContext();

export const useActivity = () => useContext(ActivityContext);

export const ActivityProvider = ({ children }) => {
  // Step count
  const [stepCount, setStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  
  // Activity tracking
  const [lastActivity, setLastActivity] = useState(new Date());
  const [sedentaryTime, setSedentaryTime] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  
  // User state
  const [stressLevel, setStressLevel] = useState(0); // 0-10
  const [wellnessScore, setWellnessScore] = useState(75); // 0-100
  
  // Break tracking
  const [breaks, setBreaks] = useState([]);
  const [currentBreak, setCurrentBreak] = useState(null);
  
  // Initialize sensors
  useEffect(() => {
    let subscription = null;
    
    const checkPedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);
      
      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);
        
        const { steps } = await Pedometer.getStepCountAsync(start, end);
        setStepCount(steps);
        
        subscription = Pedometer.watchStepCount(result => {
          setStepCount(prev => prev + result.steps);
        });
      }
    };
    
    checkPedometer();
    
    // Motion detection for activity tracking
    let accelerometerSubscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      
      // If there's significant motion, update the last activity time
      if (acceleration > 1.2) { // Threshold for considering "active"
        setLastActivity(new Date());
      }
    });
    
    Accelerometer.setUpdateInterval(1000); // Check acceleration every second
    
    // Load saved data
    loadData();
    
    // Track sedentary and focus time
    const activityInterval = setInterval(() => {
      const now = new Date();
      const minutesSinceLastActivity = differenceInMinutes(now, lastActivity);
      
      // Update sedentary time if inactive for more than 2 minutes
      if (minutesSinceLastActivity > 2) {
        setSedentaryTime(prev => prev + 1/60); // Add 1 minute in hours
      }
      
      // Always update focus time (includes active and inactive periods)
      setFocusTime(prev => prev + 1/60); // Add 1 minute in hours
      
      // Calculate wellness score
      calculateWellnessScore();
      
      // Save data periodically
      saveData();
    }, 60000); // Every minute
    
    return () => {
      if (subscription) {
        subscription.remove();
      }
      accelerometerSubscription.remove();
      clearInterval(activityInterval);
    };
  }, [lastActivity]);
  
  // Calculate the overall wellness score
  const calculateWellnessScore = () => {
    // This is a simplified algorithm - you can make it more sophisticated
    const stepsScore = Math.min(stepCount / 100, 30); // Max 30 points
    const sedentaryPenalty = Math.min(sedentaryTime * 5, 20); // Max 20 points penalty
    const stressPenalty = stressLevel * 2; // Max 20 points penalty
    const breakBonus = breaks.length * 3; // 3 points per break taken
    
    const newScore = Math.max(
      0,
      Math.min(
        100,
        75 + stepsScore - sedentaryPenalty - stressPenalty + breakBonus
      )
    );
    
    setWellnessScore(Math.round(newScore));
  };
  
  // Save and load data
  const saveData = async () => {
    try {
      const data = {
        stepCount,
        sedentaryTime,
        focusTime,
        stressLevel,
        wellnessScore,
        breaks,
        lastActivity: lastActivity.toISOString(),
      };
      
      await AsyncStorage.setItem('@devwell_activity', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save activity data:', error);
    }
  };
  
  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('@devwell_activity');
      
      if (data) {
        const parsedData = JSON.parse(data);
        setStepCount(parsedData.stepCount || 0);
        setSedentaryTime(parsedData.sedentaryTime || 0);
        setFocusTime(parsedData.focusTime || 0);
        setStressLevel(parsedData.stressLevel || 0);
        setWellnessScore(parsedData.wellnessScore || 75);
        setBreaks(parsedData.breaks || []);
        setLastActivity(parsedData.lastActivity ? new Date(parsedData.lastActivity) : new Date());
      }
    } catch (error) {
      console.error('Failed to load activity data:', error);
    }
  };
  
  // Break management
  const startBreak = (type, duration) => {
    const newBreak = {
      id: Date.now().toString(),
      type,
      duration,
      startTime: new Date(),
      endTime: null,
      completed: false,
      moodAfter: null,
    };
    
    setCurrentBreak(newBreak);
    return newBreak.id;
  };
  
  const completeBreak = (breakId, moodRating) => {
    if (!currentBreak || currentBreak.id !== breakId) return false;
    
    const endTime = new Date();
    const completedBreak = {
      ...currentBreak,
      endTime,
      completed: true,
      moodAfter: moodRating,
    };
    
    setBreaks(prev => [...prev, completedBreak]);
    setCurrentBreak(null);
    
    // Reset focus time when break is completed
    setFocusTime(0);
    
    saveData();
    return true;
  };
  
  // Stress level tracking
  const updateStressLevel = (level) => {
    setStressLevel(level);
    saveData();
  };
  
  return (
    <ActivityContext.Provider
      value={{
        // Activity metrics
        stepCount,
        sedentaryTime,
        focusTime,
        stressLevel,
        wellnessScore,
        
        // Break management
        breaks,
        currentBreak,
        startBreak,
        completeBreak,
        
        // Stress tracking
        updateStressLevel,
        
        // Device capabilities
        isPedometerAvailable,
        
        // Manual control
        resetActivity: () => {
          setFocusTime(0);
          setSedentaryTime(0);
          setLastActivity(new Date());
        }
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}; 