# Fitness Tracker — iOS App Store Readiness & Expo Spec

> Cross‑platform (iOS + Android) fitness tracker built with React Native + Expo, optimized for **Apple App Store** readiness. Includes on‑device AI exercise suggestions, routine/day structure, live workout sessions, streaks, stats, widgets, and privacy‑first design.

---

## 1) Summary of Product & Scope (What we are building)

1. **Users** create multiple **routines** (e.g., Push/Pull/Legs or Upper/Lower) with **day cards** (Mon–Sun). Each day has **tags** for target muscles and a curated **exercise list** (manual or AI‑suggested).
2. **Workouts** run from a prepared day: start timer, track current exercise, complete sets, auto‑advance, end session → data saved to history.
3. **Home** shows an **activity calendar** + **current streak** + **longest streak**.
4. **Statistics** include totals (sets/reps/volume/duration) + **strength score** trendline.
5. **iOS Widgets** (Home Screen/Lock Screen) show recent activity + streaks.
6. **Privacy‑first**: local data by default; optional Apple Health integration for read/write (later phase). In‑app account deletion if a cloud account exists.

---

## 2) Core User Flows (Happy Path + Key Edges)

### 2.1 Authentication & Profile

* Email/password **or** Sign in with Apple (recommended by Apple if any 3rd‑party login exists).
* First‑run onboarding: units (kg/lb), goals (strength/hypertrophy/endurance), equipment availability (home/gym/bodyweight).

### 2.2 Routine Setup

* Create Routine → 7 **Day Cards** → add **tags** (e.g., Back, Biceps).
* Populate each day with **exercises**:

  * Manual add (name, sets, reps, target weight, notes),
  * **AI Suggest** (5 candidates) based on day tags + already added exercises.

### 2.3 Start & Run a Workout

* Open a day → **Start Workout** → persist `startedAt` timestamp (monotonic).
* For each exercise: record **sets** (reps, weight, RIR/notes). **Complete** toggles and set counters.
* **Auto‑advance** to next exercise after a set completes or when user taps "Next".
* **End Workout** → persist `endedAt`, compute duration and derived metrics; show lightweight summary toast.

### 2.4 Progress & Insights

* **Activity Calendar**: highlighted workout days; tap to open sessions.
* **Streaks**: current + historical longest; timezone‑aware (America/New_York for you during dev; use device tz in production).
* **Strength Score**: per‑day score (see §6), smoothed line chart; per‑exercise PR badges.

---

## 3) Data Model (TypeScript + Supabase Postgres)

> Cloud‑backed, privacy‑first. **Supabase Postgres** is the source of truth with **Row‑Level Security (RLS)**. Optional lightweight local cache for resiliency during an active workout (see §4 and §12). TypeScript interfaces remain similar; tables are normalized in Postgres.

### 3.1 TypeScript Interfaces (unchanged shape)

*(Same as before; maps 1:1 to Postgres schema below. Minor field type tweaks: timestamps use `string` ISO; `equipment`/`tags` are `string[]`.)*

### 3.2 Postgres DDL (Supabase)

```sql
-- Enable RLS-friendly UUIDs
create extension if not exists pgcrypto;

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  units text not null default 'metric',
  equipment jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Routines & Days
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.routine_days (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  tags jsonb not null default '[]',
  created_at timestamptz not null default now(),
  unique (routine_id, day_of_week)
);

-- Optional global catalog (read-only to users)
create table if not exists public.exercise_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  primary_muscles text[] not null default '{}',
  secondary_muscles text[] not null default '{}',
  equipment text[] not null default '{}',
  default_rep_min int,
  default_rep_max int
);

create table if not exists public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_day_id uuid not null references public.routine_days(id) on delete cascade,
  template_id uuid references public.exercise_templates(id),
  name text not null,
  target_sets int,
  target_reps int,
  target_weight numeric,
  notes text,
  sort_order int not null default 0
);

-- Sessions & Logs
create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  routine_day_id uuid references public.routine_days(id) on delete set null,
  started_at timestamptz not null,
  ended_at timestamptz,
  total_duration_sec int,
  strength_score numeric
);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  name text not null,
  template_id uuid references public.exercise_templates(id),
  sort_order int not null default 0
);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number int not null,
  reps int not null,
  weight numeric,
  rir int,
  completed_at timestamptz not null
);

-- Optional materialized day summaries (or compute client-side)
create table if not exists public.day_activity_summary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  sessions int not null default 0,
  unique (user_id, date)
);

-- Indexes
create index if not exists idx_sessions_user_started on public.workout_sessions(user_id, started_at desc);
create index if not exists idx_sets_exercise on public.workout_sets(workout_exercise_id);
```

### 3.3 Row‑Level Security (RLS) Policies

> Enable RLS on **every table** and restrict access to the authenticated user’s rows. Use subqueries to assert ownership for child tables.

```sql
alter table public.profiles enable row level security;
alter table public.routines enable row level security;
alter table public.routine_days enable row level security;
alter table public.exercise_templates enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_sets enable row level security;
alter table public.day_activity_summary enable row level security;

-- profiles: a user can read/update only their profile
create policy "read own profile" on public.profiles for select using (id = auth.uid());
create policy "update own profile" on public.profiles for update using (id = auth.uid());
create policy "insert self profile" on public.profiles for insert with check (id = auth.uid());

-- routines and routine_days: owner-only
create policy "routines owner all" on public.routines for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "routine_days owner all" on public.routine_days for all
  using (exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid()));

-- routine_exercises: must belong to the user's routine_day
create policy "routine_ex owner all" on public.routine_exercises for all
  using (exists (
    select 1 from public.routine_days d join public.routines r on r.id = d.routine_id
    where d.id = routine_day_id and r.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.routine_days d join public.routines r on r.id = d.routine_id
    where d.id = routine_day_id and r.user_id = auth.uid()
  ));

-- workout_sessions: owner-only
create policy "sessions owner all" on public.workout_sessions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- workout_exercises: must belong to the user's session
create policy "wex owner all" on public.workout_exercises for all
  using (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.workout_sessions s where s.id = session_id and s.user_id = auth.uid()));

-- workout_sets: must belong to the user's workout_exercise
create policy "wset owner all" on public.workout_sets for all
  using (exists (
    select 1 from public.workout_exercises e join public.workout_sessions s on s.id = e.session_id
    where e.id = workout_exercise_id and s.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.workout_exercises e join public.workout_sessions s on s.id = e.session_id
    where e.id = workout_exercise_id and s.user_id = auth.uid()
  ));

-- day_activity_summary: owner-only
create policy "day summary owner all" on public.day_activity_summary for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- exercise_templates: public read, admin write (seeded by you)
create policy "templates public read" on public.exercise_templates for select using (true);
```

**Notes**

* Use **foreign keys + ON DELETE CASCADE** so account deletion cleans up data.
* Prefer **numeric** for weights (kg/lb) and sum with `coalesce` in analytics.
* For timezone‑aware streaks, compute on client using device TZ; store UTC in DB.
* If you want server‑computed summaries, create a **materialized view** and refresh via a **cron** function in Supabase.

---

## 4) State Management & Navigation

* **React Navigation** with a bottom tab bar: `Home` (Calendar), `Workouts` (Routines/Days), `Statistics`, `Settings`.
* **Zustand** (lean) or **Redux Toolkit** (if you prefer predictability):

  * `workout.activeSession` (id, startedAt, currentExerciseId, appState timestamps),
  * `routines` cache (normalized),
  * `stats` cache (memoized selectors for streaks & monthly aggregates),
  * `ui` (toasts, modals, confirmation dialogs).
* **Timer correctness**: never trust JS setInterval alone. Persist `startedAt`, compute elapsed = `now() - startedAt` on each tick and on app resume; use `AppState` events + monotonic time.
* **Keep‑awake** during workouts: `expo-keep-awake`.

---

## 5) iOS‑Specific Implementation Notes

### 5.1 Sign in with Apple (via Supabase) & Account Deletion

* **Auth Provider**: Use Supabase OAuth `provider: 'apple'` alongside email/password (or magic links). This satisfies Apple’s requirement if any 3rd‑party sign‑in exists.
* **Deep Link Redirect**: Configure Expo Linking (scheme, e.g., `fitapp://`) and pass `redirectTo` to Supabase (see §12.3). Handle the `/auth/callback` route to exchange the code for a session.
* **Session Storage**: Persist via **AsyncStorage** or **SecureStore** through `supabase.auth` custom storage adapter.
* **Account Deletion (required if accounts exist)**: Implement an **Edge Function** using the **service_role** key to call the Auth Admin API and `deleteUser(auth.uid())`; DB rows cascade via foreign keys. Expose an authenticated HTTPS endpoint that validates JWT → deletes account → revokes sessions. Add a Settings → “Delete Account” flow.

### 5.2 HealthKit (Optional, Phase 2)

* Reading/writing workouts requires **HealthKit entitlements** (add via config plugin) and purpose strings (`NSHealthShareUsageDescription`, `NSHealthUpdateUsageDescription`).
* Use a maintained RN bridge (e.g., `react-native-health`) with a **development build** (prebuild + config plugin) in Expo.

### 5.3 Widgets (Home/Lock Screen)

* iOS widgets require a **WidgetKit extension (Swift/SwiftUI)**.
* Approach in Expo:

  1. **Prebuild** (`npx expo prebuild`) to generate native projects.
  2. Add a **config plugin** that creates a Widget Extension target and an **App Group**.
  3. Share read‑only summaries (e.g., streak count, last workout date) via **UserDefaults (App Group)** or a small JSON file in the shared container.
  4. The widget uses a **TimelineProvider** to refresh on schedule / after app writes.

### 5.4 Live Activities (Optional)

* To show an on‑going workout on **Lock Screen** / **Dynamic Island**, integrate **ActivityKit** via a RN bridge; write minimal Swift wrapper. Data source is the active session store.

### 5.5 Background Behavior

* If the app backgrounds, **persist** and compute deltas on resume; avoid long‑running background timers.
* Use **local notifications** for rest timers while backgrounded (phase 2).

### 5.6 Deep Linking & OAuth Redirects (iOS)

* Add to `app.json`/`app.config`:

  * `scheme: "fitapp"` (or your choice),
  * `expo.extra.router.redirectUri` if using expo-router,
  * iOS `bundleIdentifier` and Associated Domains only if you later use Universal Links.
* Build redirect URL via `Linking.createURL('/auth/callback')` and register that route in your navigator to call `exchangeCodeForSession`.

### 5.7 External Checkout UX (US‑only)

* Use `WebBrowser.openBrowserAsync(checkoutUrl)` to open Stripe Checkout.
* On return (success/cancel URLs), either deep‑link back with a `fitapp://success` scheme or simply **listen for RC webhook** update and **pull CustomerInfo** when the app regains focus.

---

## 6) Metrics & Algorithms

### 6.1 Strength Score (pick one, keep consistent)

* **Option A — Volume‑Only**: (score_d = \sum_{sets\ on\ day\ d} (weight \times reps)). Normalize per bodyweight or equipment if desired.
* **Option B — 1RM‑Weighted** (per exercise): estimate 1RM via **Epley** (1RM = w(1 + r/30)) or **Brzycki** (1RM = w \times \frac{36}{37 - r}); score is sum of 1RM deltas vs. prior bests.
* **Option C — Hybrid**: (score_d = \alpha \cdot Volume_d + (1-\alpha) \cdot PR_points_d), where PR points reward new records.
* **Smoothing**: 7‑day **EMA** for trendline; keep raw values for tooltips.

### 6.2 Streaks

* A **workout day** is any local calendar day with ≥1 ended session.
* `currentStreak` increments if `today` has session(s) or `yesterday` did and `today` not yet ended; `longestStreak` is max over history.

### 6.3 AI Exercise Recommendation (On‑Device, Deterministic)

* **Inputs**: day tags, user equipment, exercises already added (avoid duplicates), recent fatigue proxy (recent volume for same muscles).
* **Catalog**: curated `ExerciseTemplate[]` with metadata (primary/secondary muscles, equipment, difficulty).
* **Scoring**:

  * Base score = tag overlap (primary: +3, secondary: +1),
  * Equipment filter (must be available),
  * Diversity penalty if same movement pattern already chosen (−2),
  * Fatigue penalty if same primary muscle logged with high volume in last N days (−k).
* **Select Top‑5** non‑duplicate exercises; break ties with novelty (not used recently).
* **Why this works**: simple, explainable, fast, privacy‑preserving; can later swap with a small TFLite/ONNX model behind the same interface.

---

## 6.4 Monetization & Subscriptions (US‑only, Stripe Checkout via web + RevenueCat)

**Scope:** The app targets **U.S. customers only**. Purchases are completed **on the web with Stripe Checkout** (opened from the app), **no in‑app IAP**. We still use **RevenueCat** to unify entitlements and reflect web purchases inside the app.

**Why this setup**

* U.S. App Store currently permits linking out to an external payment flow; Stripe handles checkout + taxes, and RevenueCat mirrors entitlements so the app can read `pro` status reliably.

**Product model**

* **Entitlement:** `pro` → unlocks “more than 2 routines.”
* **Offering:** `default` with monthly & annual packages (managed in RevenueCat for copy/pricing display; purchases happen on web).
* **Stripe:** Product + Prices for web checkout.

**Flow**

1. User taps **Upgrade** (or attempts to create a 3rd routine).
2. App opens **Stripe Checkout** in the browser (`expo-web-browser`), using a **Checkout Session URL** created by a Supabase Edge Function.
3. On success, **RevenueCat’s Stripe integration** (recommended) or your **Stripe webhook** grants the `pro` entitlement.
4. App refreshes **RevenueCat CustomerInfo** to reflect `pro` and lets the user create unlimited (or higher‑cap) routines.

**Server sync (Supabase)**

* Mirror entitlement into `public.user_entitlements` via **RevenueCat webhook** → set `pro`, `expires_at`, and `max_routines` (e.g., 50).
* **RLS** enforces routine cap: allow `INSERT` into `routines` if `pro = true` or `COUNT(routines) < max_routines` (default 2).

**Edge cases**

* Expirations/grace: UI trusts RevenueCat CustomerInfo; webhook keeps DB mirror current.
* Sign‑in: set RevenueCat `appUserID = auth.uid()` on login; clear on logout.

**Compliance note**

* This design assumes **U.S. distribution only**. If you later expand internationally, you’ll likely need to add **StoreKit IAP** for iOS regions where external checkout isn’t permitted.

---

## 7) UI & Libraries (Expo‑friendly)

* **Navigation**: `@react-navigation/native`, `@react-navigation/bottom-tabs`.
* **State**: `zustand` (or Redux Toolkit).
* **Forms**: `react-hook-form` + `zod`.
* **Backend**: `@supabase/supabase-js` v2; `expo-linking` + `expo-web-browser` for OAuth; `@react-native-async-storage/async-storage` or `expo-secure-store` for auth storage.
* **Charts**: `victory-native` or `react-native-svg-charts`.
* **Calendar**: `react-native-calendars`.
* **Icons**: `@expo/vector-icons`.
* **Theming**: `react-native-paper` or Tailwind (`nativewind`).
* **Keep Awake**: `expo-keep-awake` during active workouts.
* **Apple**: `expo-apple-authentication` optional (native button UI), HealthKit & Widgets via config plugins + dev build.

---

## 8) App Store Readiness Checklist (iOS)

* **Privacy**

  * App Privacy (nutrition labels): data categories (Workout logs, identifiers if any account), data use (analytics, app functionality).
  * If HealthKit: purpose strings and limited scopes; never use health data for marketing or ads.
  * In‑app **account deletion** if accounts exist.
* **Design & UX**

  * Clear "not medical advice" disclaimer in Settings/About.
  * Accessible tap targets; Dynamic Type friendly.
* **Sign‑in**

  * If any 3rd‑party sign‑in offered, include **Sign in with Apple**.
* **Widgets / Live Activities** (if shipped)

  * App Group configured; extension bundle IDs; timelines tested on device.
* **Review Assets**

  * App name, subtitle, keywords; localized screenshots (5.5"/6.7"), preview video (optional), support URL & privacy policy URL.
* **Build & Distribution**

  * EAS build for iOS; upload to App Store Connect; TestFlight internal/external testing.

---

## 9) MVP Milestones (Incremental)

1. **M0: Supabase Project & Auth** — Create project; Apple OAuth; deep link; profiles bootstrap.
2. **M1: Schema & RLS** — Apply SQL & policies; seed `exercise_templates`.
3. **M2: Routines & Days** — CRUD + tags; reads/writes to Supabase.
4. **M3: Workout Engine** — Sessions/sets; timer correctness; keep‑awake.
5. **M4: Calendar & Streaks** — Marked dates; summaries.
6. **M5: Stats** — Aggregates + strength score.
7. **M6: AI Suggestions v1** — Deterministic scorer.
8. **M7: Monetization (US‑only)** — **Stripe Checkout web flow** + **RevenueCat entitlements**; add `user_entitlements`, RLS insert cap; implement RC + Stripe webhooks.
9. **M8: iOS Polishing** — Settings, account deletion, privacy text, paywall copy.
10. **M9: Widgets (Optional)** — App Group + WidgetKit.
11. **M10: Beta** — TestFlight + analytics.

## 10) Risks & Mitigations

* **Widget integration with Expo**: requires prebuild + Swift extension → plan this as a separate milestone; keep widget data tiny (App Group shared JSON).
* **Timer drift / backgrounding**: use stored timestamps + deltas; avoid setInterval drift.
* **Data migration**: version tables; include `PRAGMA user_version` and simple migration scripts.
* **AI expectations**: start with rule‑based recommendations; message that suggestions are powered by on‑device logic and can be tuned.

---

## 11) Open Decisions (to finalize later)

* Pick **state library** (Zustand vs Redux Toolkit).
* Choose **charting** library based on current maintenance.
* Decide **Strength Score** formula (A/B/C) and stick to it for continuity.
* Determine whether to ship **Sign in** at MVP or defer (if local‑only, still implement account deletion if account creation exists).
* Scope of **Widget** (calendar dots only vs streak counter vs both) for initial ship.

---

## 12) Implementation Notes & Snippets (pseudocode)

### 12.1 AI Suggestion (deterministic)

```ts
function suggestExercises({ dayTags, equipment, existingNames, history }) {
  const recentVolume = computeRecentVolumeByMuscle(history, 7);
  const candidates = catalog.filter(c => hasEquipment(c, equipment) && !existingNames.has(c.name));
  const scored = candidates.map(c => {
    const tagScore = 3 * overlap(c.primary, dayTags) + 1 * overlap(c.secondary ?? [], dayTags);
    const fatiguePenalty = sum(c.primary.map(m => fatigueCost(recentVolume[m])));
    const diversityPenalty = movementPatternPenalty(c, existingNames);
    return { item: c, score: tagScore - fatiguePenalty - diversityPenalty };
  });
  return topK(scored, 5).map(x => x.item);
}
```

### 12.2 Streaks (timezone‑aware)

```ts
function computeStreaks(completedDates: string[]) {
  const set = new Set(completedDates);
  let longest = 0, current = 0;
  for (const day of enumerateDays(minDate(set), today())) {
    if (set.has(day)) { current++; longest = Math.max(longest, current); }
    else { current = 0; }
  }
  return { current, longest };
}
```

### 12.3 Supabase client & OAuth (Expo)

```ts
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false // handled by Expo Linking
  }
});

export async function signInWithApple() {
  const redirectTo = Linking.createURL('/auth/callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo }
  });
  if (error) throw error;
  return data;
}

// In your callback route component
export async function handleAuthCallback(url: string) {
  const { data, error } = await supabase.auth.exchangeCodeForSession(url);
  if (error) throw error;
  return data.session;
}
```

### 12.4 Account Deletion (Edge Function outline)

```ts
// supabase/functions/delete-account/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (req: Request) => {
  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const jwt = req.headers.get('Authorization')?.replace('Bearer ', '')!;
  const { data: user, error: authErr } = await supa.auth.getUser(jwt);
  if (authErr || !user) return new Response('unauthorized', { status: 401 });
  const { error } = await supa.auth.admin.deleteUser(user.user.id);
  if (error) return new Response(error.message, { status: 500 });
  return new Response('ok');
};
```

### 12.5 Offline logging (optional)

* Keep an **in‑memory + AsyncStorage queue** of pending writes while a workout is active. On reconnect/app focus, **flush** to Supabase.
* Use **idempotency keys** (client‑generated UUIDs) to avoid duplicate inserts on retries.

### 12.6 Stripe Checkout session (US‑only) + webhooks

```ts
// Client: start checkout
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabaseClient';

export async function startCheckout(plan: 'monthly'|'annual') {
  const { data, error } = await supabase.functions.invoke('create-checkout-session', { body: { plan } });
  if (error) throw error;
  await WebBrowser.openBrowserAsync(data.url); // Stripe Checkout URL
}
```

```ts
// Supabase Edge Function: create-checkout-session (Stripe)
import Stripe from 'https://esm.sh/stripe@13?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (req: Request) => {
  const { plan } = await req.json();
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' });
  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);
  const { data: { user } } = await supa.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ','')!);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const priceId = plan === 'annual' ? Deno.env.get('STRIPE_PRICE_ANNUAL')! : Deno.env.get('STRIPE_PRICE_MONTHLY')!;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email!,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: Deno.env.get('CHECKOUT_SUCCESS_URL')!,
    cancel_url: Deno.env.get('CHECKOUT_CANCEL_URL')!,
    metadata: { app_user_id: user.id }
  });
  return new Response(JSON.stringify({ url: session.url }), { headers: { 'Content-Type': 'application/json' } });
};
```

```ts
// RevenueCat webhook → Supabase: upsert entitlement mirror
// (If using RC’s Stripe integration, set RC webhook to this function)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (req: Request) => {
  const payload = await req.json();
  const app_user_id = payload?.app_user_id;
  const pro = Boolean(payload?.entitlements?.pro?.active);
  const expires = payload?.entitlements?.pro?.expires_at ?? null;

  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  await supa.from('user_entitlements').upsert({
    user_id: app_user_id,
    pro,
    max_routines: pro ? 50 : 2,
    expires_at: expires,
    updated_at: new Date().toISOString()
  });
  return new Response('ok');
};
```

---

## 13) Testing Strategy

* **Unit**: reducers/selectors (Zustand/Redux), repositories (SQLite), utility functions (streaks, strength).
* **Component**: forms, list virtualization, timer display against app state transitions.
* **E2E**: Detox flows (create routine → run workout → see calendar mark → view stats).
* **Manual iOS**: Background/foreground, airplane mode, widget timeline refresh, Sign in with Apple flow.

---

## 14) What to Build First (Actionable Next Steps)

1. Initialize Expo app (`npx create-expo-app`), add navigation/theme scaffolding.
2. Add `expo-sqlite` + create tables (DDL above) + small repository layer.
3. Seed **ExerciseTemplate** catalog (JSON file) with ~60 common movements + metadata.
4. Implement **Routines & Days** UI + tags.
5. Implement **Workout Session** logging with correct timekeeping + keep‑awake.
6. Build **Activity Calendar** + streaks; validate with mock histories.
7. Implement **Strength Score (Option A)** + line chart on Statistics tab.
8. Wire **AI Suggestion v1** scoring (deterministic) behind a feature flag.
9. Add **Settings** (units/equipment) and copy for App Store privacy.
10. Prepare for **Sign in with Apple** and **account deletion** if user accounts will ship.
