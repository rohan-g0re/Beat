/**
 * Root Navigator - Auth vs Main app navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@hooks/useAuth';
import { useProfileStatus } from '@hooks/useProfileStatus';
import { linking } from './linking';

// Import navigators and screens
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingScreen } from '@screens/auth/OnboardingScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { loading: profileLoading, isComplete } = useProfileStatus(user?.id || null);

  if (authLoading || (isAuthenticated && profileLoading)) {
    // TODO: Replace with proper loading screen
    return null;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !isComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

