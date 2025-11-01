/**
 * OnboardingScreen - First-run setup (units, equipment)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Onboarding Screen</Text>
      <Text style={styles.subtitle}>TODO: Implement units & equipment selection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#6E6E6E',
    fontSize: 14,
    marginTop: 8,
  },
});

