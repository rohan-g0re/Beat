/**
 * DayDetailScreen - Tags + exercise list + suggestions
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutsStackParamList } from '@types/navigation';

type Props = NativeStackScreenProps<WorkoutsStackParamList, 'DayDetail'>;

export const DayDetailScreen = ({ route }: Props) => {
  const { routineId, dayId } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Day Details</Text>
      <Text style={styles.subtitle}>Routine: {routineId}</Text>
      <Text style={styles.subtitle}>Day: {dayId}</Text>
      <Text style={styles.subtitle}>TODO: Tags, exercise list, AI suggestions</Text>
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

