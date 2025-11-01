-- =====================================================
-- Migration: 00002_workout_sessions
-- Description: Sessions, exercises, and sets tables
-- =====================================================

-- =====================================================
-- Workout Sessions Table
-- =====================================================

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

comment on table public.workout_sessions is 'Completed workout sessions';
comment on column public.workout_sessions.strength_score is 'Calculated strength score (volume-based)';

-- =====================================================
-- Workout Exercises Table
-- =====================================================

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  name text not null,
  sort_order int not null default 0
);

comment on table public.workout_exercises is 'Exercises logged in a session';

-- =====================================================
-- Workout Sets Table
-- =====================================================

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number int not null,
  reps int not null,
  weight numeric,
  rir int check (rir between 0 and 10),
  completed_at timestamptz not null default now()
);

comment on table public.workout_sets is 'Individual sets logged during workouts';
comment on column public.workout_sets.rir is 'Reps in Reserve (0-10)';
comment on column public.workout_sets.completed_at is 'Timestamp for streak/pace calculations';

