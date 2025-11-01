/**
 * StatsScreen - Aggregates, strength score chart
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const StatsScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Statistics</Text>
      <Text style={styles.subtitle}>TODO: Aggregates, strength score chart, PR tracking</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6E6E6E',
    fontSize: 14,
  },
});

