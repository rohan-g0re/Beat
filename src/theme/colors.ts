/**
 * Color palette - Modern fitness app theme
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Main primary
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Secondary/Accent
  accent: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800', // Main accent
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  // Success (workout completed, progress)
  success: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
  },

  // Error
  error: {
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
  },

  // Warning
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },

  // Info
  info: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
  },

  // Neutral/Grayscale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Background & Surface
  background: {
    light: '#FFFFFF',
    dark: '#000000',
    elevated: '#1C1C1E',
    card: '#2C2C2E',
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#6E6E6E',
    inverse: '#000000',
  },

  // Semantic Colors
  streak: '#FF6B35',
  volume: '#5E60CE',
  duration: '#4EA8DE',
  strength: '#06FFA5',

  // iOS System Colors (for native feel)
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemIndigo: '#5856D6',
  systemOrange: '#FF9500',
  systemPink: '#FF2D55',
  systemPurple: '#AF52DE',
  systemRed: '#FF3B30',
  systemTeal: '#5AC8FA',
  systemYellow: '#FFCC00',
};

export type ColorTheme = typeof colors;

