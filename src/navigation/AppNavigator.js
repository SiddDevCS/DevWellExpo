import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator 
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="DashboardMain" component={DashboardScreen} />
  </Stack.Navigator>
);

// Break Planner Stack
const BreakPlannerStack = () => (
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

// Break History Stack
const BreakHistoryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="BreakHistoryMain" component={BreakHistoryScreen} />
  </Stack.Navigator>
);

// Settings Stack
const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="SettingsMain" component={SettingsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
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
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="BreakPlanner" component={BreakPlannerStack} />
      <Tab.Screen name="BreakHistory" component={BreakHistoryStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default AppNavigator; 