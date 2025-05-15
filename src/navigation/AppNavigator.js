import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Text } from 'react-native';

// Import screens
import BreakDetailScreen from '../screens/BreakDetailScreen';
import BreakHistoryScreen from '../screens/BreakHistoryScreen';
import BreakPlannerScreen from '../screens/BreakPlannerScreen';
import DashboardScreen from '../screens/DashboardScreen';
import OngoingBreakScreen from '../screens/OngoingBreakScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import theme
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Dashboard Stack
const DashboardStack = () => {
  console.log('NAVIGATION: Rendering Dashboard Stack');
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

// Break Planner Stack
const BreakPlannerStack = () => {
  console.log('NAVIGATION: Rendering Break Planner Stack');
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BreakPlannerMain" component={BreakPlannerScreen} />
      <Stack.Screen name="BreakDetail" component={BreakDetailScreen} />
      <Stack.Screen 
        name="OngoingBreak" 
        component={OngoingBreakScreen} 
        options={{ 
          gestureEnabled: false,
          presentation: 'fullScreenModal',
        }} 
      />
    </Stack.Navigator>
  );
};

// Break History Stack
const BreakHistoryStack = () => {
  console.log('NAVIGATION: Rendering Break History Stack');
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BreakHistoryMain" component={BreakHistoryScreen} />
    </Stack.Navigator>
  );
};

// Settings Stack
const SettingsStack = () => {
  console.log('NAVIGATION: Rendering Settings Stack');
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    console.log('MAIN APP: User has successfully authenticated and completed onboarding');
    console.log(`MAIN APP: User ID: ${currentUser?.uid}, Email: ${currentUser?.email}`);
  }, []);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: COLORS.card,
          height: 60,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BreakPlanner') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'BreakHistory') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          return (
            <Text
              style={{
                color,
                fontSize: 12,
                fontWeight: focused ? '600' : '400',
              }}
            >
              {route.name === 'BreakPlanner' ? 'Breaks' : route.name}
            </Text>
          );
        },
      })}
      screenListeners={{
        tabPress: (e) => {
          console.log(`NAVIGATION: Tab pressed - ${e.target.split('-')[0]}`);
        },
        state: (e) => {
          console.log('NAVIGATION: Tab navigation state changed');
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack} 
        listeners={{
          focus: () => console.log('NAVIGATION: Dashboard tab focused')
        }}
      />
      <Tab.Screen 
        name="BreakPlanner" 
        component={BreakPlannerStack}
        listeners={{
          focus: () => console.log('NAVIGATION: Breaks tab focused')
        }}
      />
      <Tab.Screen 
        name="BreakHistory" 
        component={BreakHistoryStack}
        listeners={{
          focus: () => console.log('NAVIGATION: History tab focused')
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack}
        listeners={{
          focus: () => console.log('NAVIGATION: Settings tab focused')
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator; 