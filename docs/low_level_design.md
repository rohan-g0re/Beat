# Low Level Design (Sketch, Lean)

## App Structure (RN + Expo)
- Navigation (Bottom Tabs): `Home`, `Workouts`, `Statistics`, `Settings`
- Screens (examples):
  - HomeScreen: calendar grid, streak counters, session quick-links
  - RoutinesScreen: list + create/edit routine; day cards (Mon–Sun)
  - DayDetailScreen: tags selector, exercise list (manual + suggest)
  - WorkoutScreen: active session (timer, current exercise, set logger)
  - StatsScreen: aggregates + strength score chart
  - SettingsScreen: units/equipment, account deletion, upgrade/paywall

### Diagram — Lean Module Structure

```mermaid
flowchart LR
  subgraph Screens[6 Screens]
    Home --> Workout --> Stats
    Routines --> Day --> Settings
  end

  subgraph State[4 State Slices]
    WS[workout]
    RS[routines]
    US[ui]
    ES[entitlement]
  end

  subgraph Services[3 Files]
    SB[supabase.ts]
    MON[monetization.ts]
    FIT[fitness.ts]
  end

  Screens --> State
  State <--> SB
  Screens --> MON
  Screens --> FIT
```

## State (Zustand/Redux slices)
- workout: { activeSession: { id, startedAt, currentExerciseId } }
- routines: normalized cache (routines, days, exercises) — fetched on tab open
- ui: { toasts, modals, paywallVisible }
- entitlement: { pro, maxRoutines, fetchedAt } — from RevenueCat CustomerInfo

## Services / Modules (Lean: 3 files)
- **services/supabase.ts** — client init, auth storage, all DB queries (routines, sessions, sets, stats)
- **services/monetization.ts** — RevenueCat init/CustomerInfo + Stripe checkout (Edge Function call + browser open)
- **utils/fitness.ts** — on-device logic: exercise suggestions (scorer), streaks, strength score (Option A)

## Key Flows (Sequence Sketches)
- Create Routine (free)
  1) User taps "Create"
  2) Insert `routines` → RLS check (≤2 ok) → success
  3) Navigate to routine days
- Create Routine (paywalled)
  1) `supabase.insertRoutine()` → RLS rejects (≥cap) → show paywall
  2) User taps Upgrade → `monetization.startCheckout(plan)` opens Stripe
  3) Stripe success → RevenueCat webhook → `user_entitlements` updated
  4) App regains focus → `monetization.refreshCustomerInfo()` → retry insert (allowed)
- Start Workout
  1) `supabase.startSession()` → write `started_at`; activate keep-awake
  2) Timer renders `now() - startedAt` on tick/resume; no setInterval drift
  3) Set logging: `supabase.logSet()` writes to `workout_sets`; auto-advance UI
  4) End → `supabase.endSession()` sets `ended_at`; compute duration client-side

### Sequence — Paywalled Routine Creation

```mermaid
sequenceDiagram
  participant U as User
  participant App as App (RN)
  participant DB as Supabase (RLS)
  participant Stripe as Stripe Checkout
  participant RC as RevenueCat
  participant Edge as Edge Fn

  U->>App: Create routine (3rd)
  App->>DB: INSERT routines
  DB-->>App: 403 (cap via RLS)
  App->>U: Show paywall
  U->>App: Upgrade
  App->>Edge: create-checkout-session
  Edge->>Stripe: Create session URL
  Stripe-->>U: Hosted checkout
  Stripe-->>RC: Subscription update
  RC-->>Edge: Webhook (entitlement active)
  Edge->>DB: UPSERT user_entitlements
  App->>RC: Refresh CustomerInfo (on focus)
  App->>DB: Retry INSERT routines
  DB-->>App: OK (pro / cap increased)
```

## Error Handling (Minimal)
- Inline errors for failed writes; retry with backoff
- Checkout errors: toast and retry; no partial writes
- Webhook delays: UI trusts RevenueCat; pull-to-refresh entitlements

## Configuration
- Env vars: SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_ANNUAL, CHECKOUT_SUCCESS_URL, CHECKOUT_CANCEL_URL, RC_API_KEY_IOS, RC_API_KEY_ANDROID
- Exercise templates: `src/data/exerciseTemplates.json` (static)

## Build/Dist
- EAS builds; TestFlight; Sign in with Apple; privacy text


