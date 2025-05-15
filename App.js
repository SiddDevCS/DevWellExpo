import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Alert, LogBox, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ActivityProvider } from './src/contexts/ActivityContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import LoginScreen from './src/screens/LoginScreen';
import MainOnboardingScreen from './src/screens/OnboardingScreen';
import SignUpScreen from './src/screens/SignUpScreen';

// Ignore specific Firebase warnings
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core', // Common React Native warning
  '@firebase/firestore', // Ignore Firestore-specific warnings
  'Setting a timer for a long period of time', // Common Firebase timer warning
  'The action \'NAVIGATE\' with payload' // Navigation warnings during development
]);

const Stack = createNativeStackNavigator();

// Network status component to handle app-wide connectivity
const NetworkStatusMonitor = () => {
  useEffect(() => {
    console.log('NETWORK: Setting up network status monitor');
    
    // Set up network connectivity listener
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log(`NETWORK: Connection status changed - Connected: ${state.isConnected ? 'Yes' : 'No'}, Type: ${state.type}`);
      
      // Update global offline state tracker
      global._networkOffline = !state.isConnected;
      
      // Alert user when they go offline (only once)
      if (!state.isConnected && !global._hasShownNetworkOfflineAlert) {
        console.log('NETWORK: Device is offline. Showing alert.');
        global._hasShownNetworkOfflineAlert = true;
        Alert.alert(
          'You\'re Offline',
          'Some features may be limited while you\'re offline. Changes will sync when you reconnect.',
          [{ text: 'OK' }]
        );
      }
      
      // Alert user when they come back online (only once per session)
      if (state.isConnected && global._hasShownNetworkOfflineAlert && !global._hasShownNetworkOnlineAlert) {
        console.log('NETWORK: Device is back online. Showing alert.');
        global._hasShownNetworkOnlineAlert = true;
        Alert.alert(
          'You\'re Back Online',
          'Your data will now sync with the cloud.',
          [{ text: 'OK' }]
        );
      }
    });
    
    return () => {
      console.log('NETWORK: Cleaning up network status monitor');
      unsubscribe();
    };
  }, []);
  
  return null; // This component doesn't render anything
};

// Global navigation reference
let globalNavigationRef = null;

// Auth Navigator - screens available when NOT logged in
const AuthStack = () => {
  console.log('NAVIGATION: Rendering AuthStack (not logged in)');
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Onboarding" component={MainOnboardingScreen} />
    </Stack.Navigator>
  );
};

// Main Navigator - screens available when logged in and has completed onboarding
const MainStack = () => {
  console.log('NAVIGATION: Rendering MainStack (logged in, onboarding complete)');
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={AppNavigator} />
    </Stack.Navigator>
  );
};

// Onboarding Navigator - screen for a logged in user who hasn't completed onboarding
const OnboardingStack = () => {
  console.log('NAVIGATION: Rendering OnboardingStack (logged in, onboarding incomplete)');
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingFlow" component={MainOnboardingScreen} />
    </Stack.Navigator>
  );
};

// Navigation component that uses the auth context
const AppNavigation = () => {
  const { currentUser, onboardingCompleted, loading } = useAuth();
  const navigationRef = useRef();
  
  // Always call hooks in the same order
  useEffect(() => {
    // Store navigation reference globally
    if (navigationRef.current) {
      console.log('NAVIGATION: Global navigation reference set');
      globalNavigationRef = navigationRef.current;
    }
  }, [navigationRef.current]);
  
  // Log auth state changes
  useEffect(() => {
    console.log(`NAVIGATION: Auth state updated - User: ${currentUser ? 'signed in' : 'signed out'}, Onboarding: ${onboardingCompleted}, Loading: ${loading}`);
  }, [currentUser, onboardingCompleted, loading]);
  
  // Loading screen
  if (loading) {
    console.log('NAVIGATION: Showing loading screen');
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 24 }}>DevWell</Text>
        <Text style={{ color: '#B0B0B0', marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    );
  }
  
  console.log(`NAVIGATION: Determining navigation stack - User: ${currentUser ? 'signed in' : 'signed out'}, Onboarding: ${onboardingCompleted}`);
  
  return (
    <NavigationContainer 
      ref={navigationRef}
      onStateChange={() => {
        console.log('NAVIGATION: Navigation state changed');
        const currentRoute = navigationRef.current?.getCurrentRoute();
        if (currentRoute) {
          console.log(`NAVIGATION: Current screen: ${currentRoute.name}`);
        }
      }}
    >
      <StatusBar style="light" />
      <NetworkStatusMonitor />
      {currentUser ? (
        // User is signed in
        onboardingCompleted ? (
          // User has completed onboarding
          <MainStack />
        ) : (
          // User needs to complete onboarding
          <OnboardingStack />
        )
      ) : (
        // No user is signed in
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

// Expose navigation function for global use
global.navigate = (name, params) => {
  if (globalNavigationRef && globalNavigationRef.isReady()) {
    console.log(`NAVIGATION: Global navigation - Navigating to ${name}${params ? ' with params' : ''}`);
    globalNavigationRef.navigate(name, params);
    return true;
  }
  console.log(`NAVIGATION: Global navigation - Failed to navigate to ${name} (navigator not ready)`);
  return false;
};

// Main App component
export default function App() {
  console.log('APP: Initializing DevWell application');
  
  // Initialize global state trackers
  global._hasShownNetworkOfflineAlert = false;
  global._hasShownNetworkOnlineAlert = false;
  global._hasShownOfflineMessage = false;
  global._hasShownFirebaseNetworkError = false;
  global._networkOffline = false;
  
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <ActivityProvider>
            <AppNavigation />
          </ActivityProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
} 