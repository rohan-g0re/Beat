/**
 * Workout Navigator - Workout tab stack navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkoutsStackParamList } from '@types/navigation';

// Import screens
import { RoutinesScreen } from '@screens/workouts/RoutinesScreen';
import { RoutineDetailScreen } from '@screens/workouts/RoutineDetailScreen';
import { DayDetailScreen } from '@screens/workouts/DayDetailScreen';
import { WorkoutScreen } from '@screens/workouts/WorkoutScreen';

const Stack = createNativeStackNavigator<WorkoutsStackParamList>();

export const WorkoutNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTintColor: '#FFFFFF',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="RoutinesList"
        component={RoutinesScreen}
        options={{ title: 'Routines' }}
      />
      <Stack.Screen
        name="RoutineDetail"
        component={RoutineDetailScreen}
        options={{ title: 'Routine' }}
      />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={{ title: 'Day Details' }}
      />
      <Stack.Screen
        name="ActiveWorkout"
        component={WorkoutScreen}
        options={{
          title: 'Workout',
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

