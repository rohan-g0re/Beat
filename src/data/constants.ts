/**
 * App-wide constants
 */

// App Configuration
export const APP_NAME = 'FitTracker';
export const APP_VERSION = '1.0.0';

// Workout Limits
export const MAX_SETS_PER_EXERCISE = 20;
export const MAX_REPS_PER_SET = 999;
export const MAX_WEIGHT = 9999;
export const MIN_REST_TIME_SECONDS = 30;
export const MAX_REST_TIME_SECONDS = 600;

// Routine Limits
export const FREE_MAX_ROUTINES = 2;
export const PRO_MAX_ROUTINES = 50;
export const MAX_EXERCISES_PER_DAY = 20;

// UI Constants
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAYS_OF_WEEK_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Muscle Groups
export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
  'Abs',
  'Forearms',
] as const;

// Equipment Types
export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbells',
  'Kettlebell',
  'Cable Machine',
  'Resistance Bands',
  'Pull-up Bar',
  'Dip Station',
  'Bench',
  'Squat Rack',
  'Smith Machine',
  'Bodyweight',
  'Other',
] as const;

// Movement Patterns
export const MOVEMENT_PATTERNS = [
  'Push',
  'Pull',
  'Squat',
  'Hinge',
  'Lunge',
  'Carry',
  'Rotation',
  'Anti-rotation',
] as const;

// Stats Time Periods
export const STATS_PERIODS = [
  { label: 'Week', value: 7 },
  { label: 'Month', value: 30 },
  { label: '3 Months', value: 90 },
  { label: 'Year', value: 365 },
  { label: 'All Time', value: -1 },
] as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: '$4.99',
    interval: 'month',
  },
  annual: {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: '$39.99',
    interval: 'year',
    savings: '33%',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  GENERIC: 'Something went wrong. Please try again.',
  PAYWALL: 'Upgrade to Pro to create more routines.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  WORKOUT_SAVED: 'Workout saved successfully!',
  ROUTINE_CREATED: 'Routine created!',
  ROUTINE_UPDATED: 'Routine updated!',
  ROUTINE_DELETED: 'Routine deleted.',
  PROFILE_UPDATED: 'Profile updated!',
} as const;

// Analytics Events (if you add analytics later)
export const ANALYTICS_EVENTS = {
  WORKOUT_STARTED: 'workout_started',
  WORKOUT_COMPLETED: 'workout_completed',
  ROUTINE_CREATED: 'routine_created',
  EXERCISE_SUGGESTED: 'exercise_suggested',
  PAYWALL_SHOWN: 'paywall_shown',
  SUBSCRIPTION_STARTED: 'subscription_started',
} as const;

// API Timeouts
export const API_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@fittracker:auth_token',
  ACTIVE_WORKOUT: '@fittracker:active_workout',
  USER_PREFERENCES: '@fittracker:user_preferences',
  WIDGET_DATA: '@fittracker:widget_data',
} as const;

