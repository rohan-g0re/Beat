import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'FitTracker',
  slug: 'fittracker',
  version: '1.0.0',
  orientation: 'portrait',
  // icon: './assets/images/app-icon.png', // TODO: Add app icon
  scheme: 'fitapp',
  userInterfaceStyle: 'automatic',
  splash: {
    // image: './assets/images/splash.png', // TODO: Add splash image
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.fittracker.app',

    buildNumber: '1',
    infoPlist: {
      NSHealthShareUsageDescription:
        'FitTracker would like to read your workout data to provide insights and track your progress.',
      NSHealthUpdateUsageDescription:
        'FitTracker would like to write your workout data to Apple Health.',
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: ['fitapp'],
        },
      ],
    },
    entitlements: {
      'com.apple.developer.healthkit': true,
      'com.apple.developer.healthkit.access': ['health-records'],
      'com.apple.security.application-groups': ['group.com.fittracker.app'],
    },
    associatedDomains: ['applinks:fittracker.app'],
  },
  android: {
    // adaptiveIcon: {
    //   foregroundImage: './assets/images/adaptive-icon.png', // TODO: Add adaptive icon
    //   backgroundColor: '#000000',
    // },
    package: 'com.fittracker.app',
    versionCode: 1,
  },
  web: {
    bundler: 'metro',
    output: 'single',
    // favicon: './assets/images/app-icon.png', // TODO: Add favicon
  },
  plugins: [
    'expo-apple-authentication',
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '15.1',
        },
      },
    ],
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    revenueCatApiKeyIOS: process.env.EXPO_PUBLIC_RC_API_KEY_IOS,
    revenueCatApiKeyAndroid: process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID,
    eas: {
      projectId: 'your-project-id',
    },
  },
});

