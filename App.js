import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from './src/config/firebase';
import { ActivityProvider } from './src/contexts/ActivityContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import LoginScreen from './src/screens/LoginScreen';
import MainOnboardingScreen from './src/screens/OnboardingScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

// Main App component
export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user has completed onboarding
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setHasCompletedOnboarding(userDoc.data().onboardingCompleted || false);
          }
        } catch (err) {
          console.error('Error checking onboarding status:', err);
          setHasCompletedOnboarding(false);
        }
      }
      
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  // Loading screen
  if (!isReady) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 24 }}>DevWell</Text>
        <Text style={{ color: '#B0B0B0', marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <ActivityProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                  // User is signed in
                  hasCompletedOnboarding ? (
                    // User has completed onboarding
                    <Stack.Screen name="Main" component={AppNavigator} />
                  ) : (
                    // User needs to complete onboarding
                    <Stack.Screen name="Onboarding" component={MainOnboardingScreen} />
                  )
                ) : (
                  // No user is signed in
                  <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="Onboarding" component={MainOnboardingScreen} />
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </ActivityProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
} 