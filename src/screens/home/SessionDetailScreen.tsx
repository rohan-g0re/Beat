/**
 * SessionDetailScreen - View past workout details
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'SessionDetail'>;

export const SessionDetailScreen = ({ route }: Props) => {
  const { sessionId } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Session Details</Text>
      <Text style={styles.subtitle}>Session ID: {sessionId}</Text>
      <Text style={styles.subtitle}>TODO: Display workout session details</Text>
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

