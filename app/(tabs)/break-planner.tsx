import { Stack } from 'expo-router';
import React from 'react';
import BreakPlannerScreen from '../../src/screens/BreakPlannerScreen';

export default function BreakPlanner() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BreakPlannerScreen />
    </>
  );
} 