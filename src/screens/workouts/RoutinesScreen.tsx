/**
 * RoutinesScreen - List all routines
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const RoutinesScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Routines</Text>
      <Text style={styles.subtitle}>TODO: List routines with create button</Text>
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

