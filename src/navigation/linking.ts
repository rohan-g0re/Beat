/**
 * Deep linking configuration for OAuth callbacks
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<any> = {
  prefixes: [prefix, 'fitapp://'],
  config: {
    screens: {
      Auth: {
        screens: {
          SignIn: 'auth/signin',
          Onboarding: 'auth/onboarding',
        },
      },
      Main: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'home',
              SessionDetail: 'session/:sessionId',
            },
          },
          Workouts: {
            screens: {
              RoutinesList: 'routines',
              RoutineDetail: 'routines/:routineId',
              DayDetail: 'routines/:routineId/day/:dayId',
              ActiveWorkout: 'workout',
            },
          },
          Statistics: 'stats',
          Settings: 'settings',
        },
      },
      // OAuth callback
      AuthCallback: 'auth/callback',
      // Checkout callbacks
      CheckoutSuccess: 'checkout/success',
      CheckoutCancel: 'checkout/cancel',
    },
  },
};

