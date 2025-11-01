/**
 * OnboardingScreen - Fitness information setup after signup
 * Collects height, weight, units preference, and available equipment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { updateProfile } from '@services/supabase';

// Same equipment list as AccountInformationScreen
const EQUIPMENT_OPTIONS = [
  'Dumbbells',
  'Barbell',
  'Resistance Bands',
  'Pull-up Bar',
  'Bench',
  'Squat Rack',
  'Cable Machine',
  'Kettlebells',
  'Bodyweight Only',
];

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { userId } = useCurrentUser();
  
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getHeightLabel = () => {
    return units === 'metric' ? 'Height (cm)' : 'Height (inches)';
  };

  const getWeightLabel = () => {
    return units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)';
  };

  const getHeightPlaceholder = () => {
    return units === 'metric' ? '175' : '69';
  };

  const getWeightPlaceholder = () => {
    return units === 'metric' ? '75' : '165';
  };

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleCompleteSetup = async () => {
    // Validation
    if (!height || !weight) {
      Alert.alert('Required Fields', 'Please enter your height and weight');
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || heightNum <= 0) {
      Alert.alert('Invalid Height', 'Please enter a valid height');
      return;
    }

    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight');
      return;
    }

    if (equipment.length === 0) {
      Alert.alert('Equipment Required', 'Please select at least one equipment option');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User not found. Please try signing in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await updateProfile(userId, {
        height: heightNum,
        weight: weightNum,
        units,
        equipment: equipment as any,
      });

      if (error) throw error;

      // Profile saved successfully - RootNavigator will detect the change
      // and automatically navigate to Main app on next render
      setIsSubmitting(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Logo */}
          <Text style={styles.logo}>FITTRACKER</Text>

          {/* Title */}
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            Help us personalize your workout experience
          </Text>

          {/* Units Toggle */}
          <View style={styles.unitsContainer}>
            <Text style={styles.inputLabel}>Preferred Units</Text>
            <View style={styles.unitsToggle}>
              <Text style={[styles.unitLabel, units === 'metric' && styles.unitLabelActive]}>
                Metric (kg/cm)
              </Text>
              <Switch
                value={units === 'imperial'}
                onValueChange={(value) => setUnits(value ? 'imperial' : 'metric')}
                trackColor={{ false: '#3A3A3C', true: '#3A3A3C' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#3A3A3C"
              />
              <Text style={[styles.unitLabel, units === 'imperial' && styles.unitLabelActive]}>
                Imperial (lbs/in)
              </Text>
            </View>
          </View>

          {/* Height Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{getHeightLabel()}</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder={getHeightPlaceholder()}
              placeholderTextColor="#4A4A4A"
              keyboardType="decimal-pad"
              editable={!isSubmitting}
            />
          </View>

          {/* Weight Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{getWeightLabel()}</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder={getWeightPlaceholder()}
              placeholderTextColor="#4A4A4A"
              keyboardType="decimal-pad"
              editable={!isSubmitting}
            />
          </View>

          {/* Equipment Selection */}
          <View style={styles.equipmentContainer}>
            <Text style={styles.inputLabel}>Available Equipment</Text>
            <Text style={styles.equipmentHint}>
              Select all that you have access to
            </Text>
            <View style={styles.equipmentGrid}>
              {EQUIPMENT_OPTIONS.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.equipmentChip,
                    equipment.includes(item) && styles.equipmentChipSelected,
                  ]}
                  onPress={() => toggleEquipment(item)}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[
                      styles.equipmentChipText,
                      equipment.includes(item) && styles.equipmentChipTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Complete Setup Button */}
          <TouchableOpacity
            style={[styles.completeButton, isSubmitting && styles.completeButtonDisabled]}
            onPress={handleCompleteSetup}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.completeButtonText}>Complete setup</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 4,
    marginBottom: 48,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 40,
    lineHeight: 22,
  },
  unitsContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  unitsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  unitLabel: {
    color: '#4A4A4A',
    fontSize: 14,
    fontWeight: '500',
  },
  unitLabelActive: {
    color: '#FFFFFF',
  },
  equipmentContainer: {
    marginBottom: 40,
  },
  equipmentHint: {
    color: '#6E6E6E',
    fontSize: 12,
    marginBottom: 16,
    marginTop: -4,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  equipmentChip: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  equipmentChipSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  equipmentChipText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  equipmentChipTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
