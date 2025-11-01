/**
 * Main Navigator - Bottom tabs navigation
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@types/navigation';

// Import navigators and screens
import { HomeNavigator } from './HomeNavigator';
import { WorkoutNavigator } from './WorkoutNavigator';
import { StatsScreen } from '@screens/statistics/StatsScreen';
import { SettingsScreen } from '@screens/settings/SettingsScreen';

// TODO: Replace with proper icons from @expo/vector-icons
const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopColor: '#2C2C2E',
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#6E6E6E',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          // tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutNavigator}
        options={{
          tabBarLabel: 'Workouts',
          // tabBarIcon: ({ color, size }) => <Icon name="dumbbell" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Stats',
          // tabBarIcon: ({ color, size }) => <Icon name="chart-line" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          // tabBarIcon: ({ color, size }) => <Icon name="cog" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

