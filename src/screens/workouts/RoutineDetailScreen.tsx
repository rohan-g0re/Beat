/**
 * RoutineDetailScreen - Days grid (Mon-Sun cards)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutsStackParamList } from '@types/navigation';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'RoutineDetail'>;

export const RoutineDetailScreen = ({ route }: Props) => {
  const { routineId } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Routine Details</Text>
      <Text style={styles.subtitle}>Routine ID: {routineId}</Text>
      <Text style={styles.subtitle}>TODO: Display Mon-Sun day cards</Text>
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
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6E6E6E',
    fontSize: 14,
    marginTop: 4,
  },
});

