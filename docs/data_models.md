# Data Models (Lean)

## Core Entities (Postgres, Supabase)

### profiles
- id: uuid (PK, = auth.users.id)
- email: text
- display_name: text
- units: text ('metric' default)
- equipment: jsonb [] — user’s available equipment; used to filter `exercise_templates` and on-device suggestions so only feasible movements are shown. Example: ["Barbell","Dumbbells","Pull-up Bar"]. Empty array means bodyweight/none. Values should match template `equipment` labels.
- created_at: timestamptz

### routines
- id: uuid (PK)
- user_id: uuid (FK → profiles.id, cascade)
- name: text
- created_at: timestamptz

### routine_days
- id: uuid (PK)
- routine_id: uuid (FK → routines.id, cascade)
- day_of_week: smallint (0=Sun..6=Sat)
- tags: jsonb [] (e.g., ["Back","Biceps"])
- created_at: timestamptz
- unique (routine_id, day_of_week)

### routine_exercises
- id: uuid (PK)
- routine_day_id: uuid (FK → routine_days.id, cascade)
- name: text — exercise name (from template JSON or custom user input)
- target_sets: int (nullable)
- target_reps: int (nullable)
- target_weight: numeric (nullable)
- notes: text (nullable)
- sort_order: int (default 0) — position within the day's exercise list for stable UI rendering. Zero-based; contiguous ordering recommended but not enforced.

### workout_sessions
- id: uuid (PK)
- user_id: uuid (FK → profiles.id, cascade)
- routine_id: uuid (nullable FK → routines.id, set null)
- routine_day_id: uuid (nullable FK → routine_days.id, set null)
- started_at: timestamptz (required)
- ended_at: timestamptz (nullable)
- total_duration_sec: int (nullable)
- strength_score: numeric (nullable)

### workout_exercises
- id: uuid (PK)
- session_id: uuid (FK → workout_sessions.id, cascade)
- name: text — exercise name captured from routine or entered live
- sort_order: int (default 0)

### workout_sets
- id: uuid (PK) — unique set identifier; client-generated UUIDs recommended for idempotent retries.
- workout_exercise_id: uuid (FK → workout_exercises.id, cascade) — parent exercise instance; cascades on delete to keep session tree consistent.
- set_number: int — 1‑based ordinal of set within `workout_exercise`; used for ordering and summaries.
- reps: int — repetitions performed; positive integer; used in volume/strength calculations.
- weight: numeric (nullable) — weight used in the user’s configured units (kg/lb); stored as numeric without unit; 0 or null for bodyweight.
- rir: int (nullable) — Reps-In-Reserve (effort indicator). Typical range 0–5 (can be null when not tracked).
- completed_at: timestamptz — UTC timestamp of set completion; drives timezone-aware day grouping, streaks, and pace analytics.

### user_entitlements (monetization)
- user_id: uuid (PK, FK → profiles.id, cascade)
- pro: boolean (default false)
- max_routines: int (default 2)
- expires_at: timestamptz (nullable)
- updated_at: timestamptz (default now())

## Exercise Templates (JSON, not DB)
- Stored as `src/data/exerciseTemplates.json` (~60 common movements)
- Schema: `{ id, name, primaryMuscles[], secondaryMuscles[], equipment[], defaultRepMin, defaultRepMax }`
- Used by on-device AI scorer; filtered by user's available equipment
- No DB table needed; reduces schema complexity and seeding overhead

## Relationships
- profiles 1–N routines
- routines 1–N routine_days; routine_days 1–N routine_exercises
- workout_sessions belong to user; optional links to routine/routine_day
- workout_sessions 1–N workout_exercises 1–N workout_sets
- user_entitlements 1–1 profiles

## Policies (RLS Summary)
- Ownership enforced on all user-scoped tables (`user_id = auth.uid()` or via subquery)
- `routines` INSERT gated by entitlement: allow if `pro` OR current count < `max_routines` (fallback to 2 if no entitlement row yet)

## Indexes (Essentials)
- `idx_sessions_user_started` on (user_id, started_at desc)
- `idx_sets_exercise` on (workout_exercise_id)


