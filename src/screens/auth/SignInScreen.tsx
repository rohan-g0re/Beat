/**
 * SignInScreen - Email/password + Sign in with Apple
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

export const SignInScreen = () => {
  const { signIn, developerBypass, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devClickCount, setDevClickCount] = useState(0);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message);
    }
  };

  const handleLogoPress = () => {
    const newCount = devClickCount + 1;
    setDevClickCount(newCount);
    
    if (newCount >= 7) {
      Alert.alert(
        'Developer Mode',
        'Bypass authentication?',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => setDevClickCount(0)
          },
          {
            text: 'Bypass',
            onPress: () => {
              developerBypass();
              setDevClickCount(0);
            },
          },
        ]
      );
    }
  };

  if (!showForm) {
    // Landing screen
    return (
      <View style={styles.landingContainer}>
        <StatusBar style="light" />
        
        {/* Background gradient effect */}
        <View style={styles.backgroundGradient} />

        <View style={styles.landingContent}>
          {/* Logo - tap 7 times for developer bypass */}
          <TouchableOpacity 
            onPress={handleLogoPress}
            activeOpacity={0.9}
            style={styles.logoContainer}
          >
            <Text style={styles.logo}>FITTRACKER</Text>
          </TouchableOpacity>

          <View style={styles.heroTextContainer}>
            <Text style={styles.heroText}>
              JOIN THE{'\n'}
              COLLECTIVE.{'\n'}
              POWER{'\n'}
              YOUR PURSUIT.
            </Text>
          </View>

          <View style={styles.landingButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowForm(true)}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => Alert.alert('Coming Soon', 'Account creation will be available soon')}
            >
              <Text style={styles.secondaryButtonText}>Create FitTracker account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Sign in form
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
          <TouchableOpacity 
            onPress={handleLogoPress}
            activeOpacity={0.9}
          >
            <Text style={styles.formLogo}>FITTRACKER</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Sign in</Text>

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
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => Alert.alert('Coming Soon', 'Password reset will be available soon')}
          >
            <Text style={styles.forgotPassword}>Forgot password</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            By clicking "Sign in", you agree to our{' '}
            <Text style={styles.link}>Terms and Conditions</Text> and consent to our{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, isSubmitting && styles.signInButtonDisabled]}
            onPress={handleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.signInButtonText}>Sign in</Text>
            )}
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowForm(false)}
            disabled={isSubmitting}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Landing Screen Styles
  landingContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A1A1A',
    opacity: 0.95,
  },
  landingContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignSelf: 'flex-start',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 4,
  },
  heroTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -80,
  },
  heroText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
    letterSpacing: -1,
  },
  landingButtons: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Form Screen Styles
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
  formLogo: {
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
  forgotPassword: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 24,
    textDecorationLine: 'underline',
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
  signInButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#8E8E93',
    fontSize: 16,
  },
});

