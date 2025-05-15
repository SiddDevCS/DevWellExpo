import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import OngoingBreakScreen from '../src/screens/OngoingBreakScreen';

export default function OngoingBreak() {
  const params = useLocalSearchParams();
  // Parse the breakType from JSON string if needed
  const breakType = params.breakType ? JSON.parse(params.breakType as string) : undefined;
  const breakId = params.breakId as string;
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false, 
          presentation: 'fullScreenModal',
          gestureEnabled: false
        }} 
      />
      <OngoingBreakScreen 
        route={{ params: { breakType, breakId } }}
      />
    </>
  );
} 