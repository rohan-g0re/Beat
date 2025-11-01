/**
 * PaywallScreen - Upgrade flow (modal or screen)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PaywallScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade to Pro</Text>
      <Text style={styles.subtitle}>TODO: Pricing, features list, checkout button</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6E6E6E',
    fontSize: 14,
    textAlign: 'center',
  },
});

