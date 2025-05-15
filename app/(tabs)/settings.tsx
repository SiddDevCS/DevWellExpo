import { Stack } from 'expo-router';
import React from 'react';
import SettingsScreen from '../../src/screens/SettingsScreen';

export default function Settings() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SettingsScreen />
    </>
  );
} 