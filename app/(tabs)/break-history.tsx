import { Stack } from 'expo-router';
import React from 'react';
import BreakHistoryScreen from '../../src/screens/BreakHistoryScreen';

export default function BreakHistory() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BreakHistoryScreen />
    </>
  );
} 