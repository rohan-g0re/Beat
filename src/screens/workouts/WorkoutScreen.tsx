/**
 * WorkoutScreen - Active workout session (timer, set logger)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useWorkoutTimer } from '@hooks/useWorkoutTimer';

export const WorkoutScreen = () => {
  const { formattedTime, isRunning } = useWorkoutTimer();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Active Workout</Text>
      <Text style={styles.timer}>{formattedTime}</Text>
      <Text style={styles.subtitle}>
        {isRunning ? 'Workout in progress...' : 'No active workout'}
      </Text>
      <Text style={styles.subtitle}>TODO: Exercise list, set logger, timer controls</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timer: {
    color: '#2196F3',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6E6E6E',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});

