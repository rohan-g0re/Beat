# High Level Design (Lean)

## Goals
- Ship a privacy-first, cross-platform fitness tracker (iOS/Android via React Native + Expo)
- Plan + run workouts with on-device suggestions; track progress (streaks, stats)
- Freemium: 2 routines free; US-only web checkout (Stripe) unlocks higher routine cap via RevenueCat

## Architecture Overview
- Client: React Native (Expo)
  - Tabs: Home (calendar/streaks), Workouts (routines/days), Statistics, Settings
  - State: Zustand/Redux for active session, routines cache, UI state
  - On-device AI: JSON catalog (~60 exercises) + deterministic scorer (no network)
- Backend: Supabase
  - Postgres with RLS: profiles, routines, sessions, sets, entitlements
  - Auth (email/Apple) + JWT; Edge Functions for checkout/webhooks
  - Stats computed on-demand from workout_sessions queries
- Monetization (US-only initially)
  - Stripe Checkout opened in browser via Edge Function-created session
  - RevenueCat for entitlements; webhook mirrors `pro` status to Postgres
  - RLS enforces routine cap at DB layer (secure by default)
- iOS Specific (optional phases): WidgetKit (streaks/activity); HealthKit later

### Diagrams — System Blocks

```mermaid
flowchart LR
  subgraph Client[React Native + Expo]
    Screens[Home / Workouts / Statistics / Settings]
    State[State Store (Zustand/Redux)]
    Features[On-device Suggestions • Streaks • Strength]
  end

  subgraph Backend[Supabase]
    Auth[Auth (Email / Apple)]
    DB[(Postgres + RLS)]
    Edge[Edge Functions]
  end

  subgraph Monetization[US-only Monetization]
    Stripe[Stripe Checkout (web)]
    RC[RevenueCat Entitlements]
  end

  subgraph iOSOptional[iOS Optional]
    Widget[WidgetKit]
    Health[HealthKit]
  end

  Screens --> State
  Features --> State
  State <--> DB
  Screens --> Edge
  Auth --> DB
  Edge --> DB

  Screens -->|Upgrade| Stripe --> RC --> Edge
  Edge -->|Mirror entitlement| DB
  State -->|Refresh| RC
```

## Core Data Flows
1) Authentication
   - Supabase OAuth (Sign in with Apple) or email; session stored securely
2) Routines & Days
   - CRUD to Supabase; `routine_days` with tags; `routine_exercises` ordered list
   - Insert into `routines` gated by RLS (free ≤2, pro higher cap)
3) Workout Session
   - Start: persist `started_at`; keep-awake; timer from timestamps (no drifting)
   - Log sets: reps/weight/RIR with `completed_at`; auto-advance exercises
   - End: set `ended_at`, compute duration/derived metrics
4) Progress & Insights
   - Query workout_sessions grouped by date; compute streaks client-side (no summary table)
   - Stats: query aggregates on-demand (volume, sets, reps, duration); plot strength score
5) Monetization
   - User hits paywall on 3rd routine → start checkout → Stripe success
   - RevenueCat webhook → Supabase `user_entitlements` → app refreshes CustomerInfo

## Iterative Build (M0→M10)
1. M0: Auth • M1: Schema/RLS • M2: Routines/Days • M3: Workout Engine
2. M4: Calendar/Streaks • M5: Stats • M6: AI Suggestions
3. M7: Monetization • M8: Polishing • M9: Widgets (opt) • M10: Beta

## Non-Functional
- Privacy-first: on-device suggestions; no PII beyond auth; minimal data sharing
- Security: Postgres RLS on every table; ownership via subquery checks; paywall enforced in DB
- Resilience: optimistic writes during active session; optional offline queue
- Correctness: timestamp-based timers; timezone-aware streaks
- Distribution: App Store-ready (Sign in with Apple, account deletion, privacy labels)


