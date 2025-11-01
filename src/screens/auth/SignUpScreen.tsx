/**
 * SignUpScreen - Create new account
 * Design inspired by Equinox+ login flow
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export const SignUpScreen = () => {
  const { signUp } = useAuth();
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email, password);
    setIsSubmitting(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert(
        'Success!',
        'Account created successfully. Please sign in to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
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
          <Text style={styles.title}>Create account</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder=""
              placeholderTextColor="#4A4A4A"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={!isSubmitting}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder=""
                placeholderTextColor="#4A4A4A"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                textContentType="newPassword"
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Minimum 8 characters</Text>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder=""
                placeholderTextColor="#4A4A4A"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                textContentType="newPassword"
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          <Text style={styles.terms}>
            By creating an account, you agree to our{' '}
            <Text style={styles.link}>Terms and Conditions</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.signUpButton, isSubmitting && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.signUpButtonText}>Create account</Text>
            )}
          </TouchableOpacity>

          {/* Already have account */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text>
            </Text>
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
    marginBottom: 40,
    letterSpacing: -0.5,
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    bottom: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  hint: {
    color: '#6E6E6E',
    fontSize: 12,
    marginTop: 4,
  },
  terms: {
    color: '#8E8E93',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 32,
  },
  link: {
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginLinkText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

