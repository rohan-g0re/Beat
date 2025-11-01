# FitTracker Repository Structure

## Root Structure

```
FitTracker/
├── src/                          # Main application code
├── ios/                          # iOS native code (generated + custom)
├── android/                      # Android native code (generated)
├── supabase/                     # Backend: migrations, functions, seed data
├── assets/                       # Static assets (images, fonts, icons)
├── docs/                         # Documentation (existing)
├── .expo/                        # Expo cache (gitignored)
├── node_modules/                 # Dependencies (gitignored)
├── app.json                      # Expo configuration
├── app.config.ts                 # Dynamic Expo config (for env vars, plugins)
├── babel.config.js               # Babel configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── .env.example                  # Environment variable template
├── .env                          # Local environment variables (gitignored)
├── .gitignore                    # Git ignore rules
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── eas.json                      # EAS Build configuration
└── README.md                     # Project setup and documentation
```

---

## `/src` - Main Application Code

```
src/
├── screens/                      # Screen components (6 main screens)
│   ├── home/
│   │   ├── HomeScreen.tsx        # Calendar grid, streaks, quick-links
│   │   └── SessionDetailScreen.tsx # View past workout details
│   ├── workouts/
│   │   ├── RoutinesScreen.tsx    # List all routines
│   │   ├── RoutineDetailScreen.tsx # Days grid (Mon-Sun cards)
│   │   ├── DayDetailScreen.tsx   # Tags + exercise list + suggestions
│   │   └── WorkoutScreen.tsx     # Active workout session (timer, set logger)
│   ├── statistics/
│   │   └── StatsScreen.tsx       # Aggregates, strength score chart
│   ├── settings/
│   │   ├── SettingsScreen.tsx    # Units, equipment, account
│   │   └── PaywallScreen.tsx     # Upgrade flow (modal or screen)
│   └── auth/
│       ├── SignInScreen.tsx      # Email/password + Sign in with Apple
│       └── OnboardingScreen.tsx  # First-run setup (units, equipment)
│
├── components/                   # Reusable UI components
│   ├── common/
│   │   ├── Button.tsx            # Primary/secondary buttons
│   │   ├── Input.tsx             # Text input with validation
│   │   ├── Card.tsx              # Container component
│   │   ├── Toast.tsx             # Notification component
│   │   └── LoadingSpinner.tsx    # Activity indicator
│   ├── workouts/
│   │   ├── DayCard.tsx           # Day of week card with tags
│   │   ├── ExerciseCard.tsx      # Exercise item (target sets/reps/weight)
│   │   ├── SetLogger.tsx         # Log reps/weight/RIR for a set
│   │   ├── ExerciseSuggestions.tsx # AI-suggested exercises list
│   │   └── WorkoutTimer.tsx      # Active workout timer display
│   ├── statistics/
│   │   ├── ActivityCalendar.tsx  # Monthly calendar with workout marks
│   │   ├── StreakCounter.tsx     # Current + longest streak display
│   │   └── StrengthChart.tsx     # Line chart for strength score
│   └── settings/
│       ├── EquipmentSelector.tsx # Multi-select for available equipment
│       └── UnitsToggle.tsx       # kg/lb toggle
│
├── navigation/                   # React Navigation setup
│   ├── RootNavigator.tsx         # Root navigator (auth vs main)
│   ├── MainNavigator.tsx         # Bottom tabs (Home/Workouts/Stats/Settings)
│   ├── WorkoutNavigator.tsx      # Stack for workout flows
│   └── linking.ts                # Deep linking config (OAuth callback)
│
├── store/                        # Zustand state management (4 slices)
│   ├── index.ts                  # Combined store export
│   ├── workoutStore.ts           # activeSession, timer state
│   ├── routinesStore.ts          # Normalized routines/days/exercises cache
│   ├── uiStore.ts                # Toasts, modals, paywall visibility
│   └── entitlementStore.ts       # pro, maxRoutines, fetchedAt
│
├── services/                     # External service integrations
│   ├── supabase.ts               # Supabase client init + all DB queries
│   ├── monetization.ts           # RevenueCat init + Stripe checkout flow
│   └── healthkit.ts              # HealthKit integration (Phase 2)
│
├── utils/                        # Pure utility functions
│   ├── fitness.ts                # Exercise suggestions scorer, strength score
│   ├── streaks.ts                # Streak computation (timezone-aware)
│   ├── timer.ts                  # Monotonic timer helpers (AppState-safe)
│   └── validation.ts             # Form validation helpers (zod schemas)
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Auth state + sign in/out
│   ├── useWorkoutTimer.ts        # Timer logic with AppState handling
│   ├── useEntitlements.ts        # RevenueCat CustomerInfo refresh
│   └── useAppState.ts            # AppState lifecycle tracking
│
├── data/                         # Static data and constants
│   ├── exerciseTemplates.json    # ~60 exercise templates (name, muscles, equipment)
│   └── constants.ts              # App-wide constants (colors, sizes, limits)
│
├── types/                        # TypeScript type definitions
│   ├── database.ts               # Supabase-generated types (from schema)
│   ├── models.ts                 # App-level interfaces (Exercise, Routine, etc.)
│   └── navigation.ts             # React Navigation param list types
│
└── theme/                        # Styling and theming
    ├── colors.ts                 # Color palette
    ├── typography.ts             # Font sizes, weights, families
    └── spacing.ts                # Margin, padding constants
```

---

## `/ios` - iOS Native Code

```
ios/
├── FitTracker/                   # Main app target (generated by prebuild)
│   ├── AppDelegate.h/.m/.mm      # App lifecycle delegates
│   ├── Info.plist                # App metadata, permissions, URL schemes
│   └── FitTracker.entitlements   # Entitlements (App Groups, HealthKit, Sign in with Apple)
│
├── FitTrackerWidget/             # WidgetKit extension target (custom)
│   ├── FitTrackerWidget.swift    # Widget entry point
│   ├── WidgetViews.swift         # SwiftUI widget views (streak, activity)
│   ├── WidgetTimelineProvider.swift # Timeline refresh logic
│   ├── Info.plist                # Widget extension metadata
│   └── Assets.xcassets/          # Widget-specific assets
│
├── Shared/                       # Shared code (App Group data access)
│   ├── SharedDataManager.swift   # Read/write streak/activity to UserDefaults (App Group)
│   └── FitTracker.entitlements   # Shared App Group identifier
│
├── Podfile                       # CocoaPods dependencies (if needed)
├── FitTracker.xcodeproj/         # Xcode project (generated)
└── FitTracker.xcworkspace/       # Xcode workspace (if using Pods)
```

**Notes:**

- Widget extension requires **config plugin** in `app.config.ts` to auto-generate target
- App Group identifier (e.g., `group.com.yourteam.fittracker`) shared between main app and widget
- HealthKit integration requires additional entitlements + config plugin

---

## `/android` - Android Native Code

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/fittracker/   # Main application code (generated)
│   │   ├── res/                    # Android resources
│   │   └── AndroidManifest.xml     # App metadata, permissions
│   └── build.gradle                # App-level Gradle config
├── gradle/                         # Gradle wrapper
└── build.gradle                    # Project-level Gradle config
```

**Notes:**

- Android structure generated by `npx expo prebuild`
- Widgets on Android would use App Widgets (future phase)

---

## `/supabase` - Backend Infrastructure

```
supabase/
├── migrations/                   # Database schema migrations (versioned)
│   ├── 00001_initial_schema.sql  # Core tables (profiles, routines, days, exercises)
│   ├── 00002_workout_sessions.sql # Sessions, exercises, sets tables
│   ├── 00003_entitlements.sql    # user_entitlements table
│   ├── 00004_rls_policies.sql    # Row-Level Security policies
│   └── 00005_indexes.sql         # Performance indexes
│
├── functions/                    # Edge Functions (Deno)
│   ├── create-checkout-session/  # Stripe Checkout session creation
│   │   └── index.ts
│   ├── stripe-webhook/           # Stripe webhook handler (optional)
│   │   └── index.ts
│   ├── revenuecat-webhook/       # RevenueCat webhook → entitlements mirror
│   │   └── index.ts
│   └── delete-account/           # Account deletion (Auth Admin API)
│       └── index.ts
│
├── seed/                         # Seed data scripts
│   └── exercise_templates.sql    # Seed 60+ exercise templates (optional DB table)
│
└── config.toml                   # Supabase local config (for CLI)
```

**Migration Strategy:**

- Run migrations via Supabase CLI: `supabase db push`
- Version control all schema changes

---

## `/assets` - Static Assets

```
assets/
├── images/
│   ├── app-icon.png              # App icon (1024x1024, multiple sizes via Expo)
│   ├── splash.png                # Splash screen
│   ├── adaptive-icon.png         # Android adaptive icon
│   └── illustrations/            # Onboarding, empty states
│       ├── empty-routines.png
│       └── onboarding-welcome.png
│
├── fonts/                        # Custom fonts (if any)
│   └── Inter-Regular.ttf
│
└── icons/                        # Custom SVG icons (or use @expo/vector-icons)
```

---

## Configuration Files (Root)

### `app.json` / `app.config.ts`

Dynamic Expo config for env vars, plugins, iOS/Android settings:

- **Scheme:** `fitapp://` for deep linking
- **Bundle ID:** `com.yourteam.fittracker`
- **Permissions:** HealthKit (iOS), Sign in with Apple
- **Config Plugins:** Widget extension, HealthKit, Sign in with Apple

### `eas.json`

EAS Build profiles (development, preview, production):

- iOS distribution certificate
- Provisioning profiles
- Environment variables per profile

### `package.json`

Key dependencies:

- `expo`, `react-native`, `react-navigation`
- `zustand` (state)
- `@supabase/supabase-js`, `@react-native-async-storage/async-storage`
- `react-native-purchases` (RevenueCat)
- `expo-apple-authentication`, `expo-web-browser`, `expo-linking`
- `expo-keep-awake`, `react-native-calendars`, `victory-native`
- `react-hook-form`, `zod`

### `.env.example`

Template for environment variables:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
EXPO_PUBLIC_RC_API_KEY_IOS=xxx
EXPO_PUBLIC_RC_API_KEY_ANDROID=xxx
```

### `tsconfig.json`

TypeScript config with path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@screens/*": ["src/screens/*"],
      "@components/*": ["src/components/*"],
      "@store/*": ["src/store/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

---

## Git Structure

### `.gitignore`

Ignore:

- `node_modules/`, `.expo/`, `dist/`
- `.env` (keep `.env.example`)
- iOS/Android build artifacts (`ios/Pods/`, `android/build/`)
- OS files (`.DS_Store`)

---

## Key File Highlights

### Critical Implementation Files

1. **`src/store/workoutStore.ts`** - Active workout session state, timer timestamps, keep-awake control
2. **`src/services/supabase.ts`** - All DB queries (routines, sessions, sets, stats); auth storage adapter
3. **`src/utils/fitness.ts`** - Exercise suggestion scorer (deterministic, on-device)
4. **`src/data/exerciseTemplates.json`** - 60+ exercises with metadata (muscles, equipment)
5. **`ios/FitTrackerWidget/WidgetTimelineProvider.swift`** - Widget data source (App Group shared data)
6. **`supabase/migrations/00004_rls_policies.sql`** - Routine cap enforcement at DB layer (secure paywall)
7. **`supabase/functions/revenuecat-webhook/index.ts`** - Mirror entitlements from RevenueCat to `user_entitlements`

---

## Scripts (package.json)

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "prebuild": "expo prebuild",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android",
    "supabase:gen-types": "supabase gen types typescript --local > src/types/database.ts"
  }
}
```

---

## Next Steps After Structure Setup

1. Initialize Expo app: `npx create-expo-app FitTracker --template blank-typescript`
2. Set up folder structure as outlined above
3. Install dependencies (Zustand, Supabase, RevenueCat, navigation, etc.)
4. Initialize Supabase project and apply migrations
5. Configure `app.config.ts` with iOS entitlements and config plugins
6. Seed `exerciseTemplates.json` with initial 60 movements
7. Implement Zustand stores (4 slices)
8. Build navigation structure (bottom tabs + stack navigators)
9. Implement core screens (M0-M3 milestones)

---

## iOS App Store Readiness Checklist

- [ ] Sign in with Apple configured (`expo-apple-authentication`)
- [ ] Account deletion endpoint (`supabase/functions/delete-account`)
- [ ] Privacy policy URL and support URL
- [ ] App Privacy nutrition labels prepared
- [ ] HealthKit purpose strings (if Phase 2 included)
- [ ] Widget extension built and tested (App Group configured)
- [ ] Deep linking tested (`fitapp://` scheme)
- [ ] TestFlight beta testing completed
- [ ] App Store screenshots and preview video
- [ ] EAS production build uploaded to App Store Connect