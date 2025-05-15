import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import BreakDetailScreen from '../src/screens/BreakDetailScreen';

export default function BreakDetail() {
  const params = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false, presentation: 'card' }} />
      <BreakDetailScreen route={{ params }} />
    </>
  );
}