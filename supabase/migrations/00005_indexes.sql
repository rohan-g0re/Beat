-- =====================================================
-- Migration: 00005_indexes
-- Description: Performance indexes
-- =====================================================

-- Profiles
create index if not exists idx_profiles_email on public.profiles(email);

-- Routines
create index if not exists idx_routines_user_id on public.routines(user_id);
create index if not exists idx_routines_created_at on public.routines(created_at desc);

-- Routine Days
create index if not exists idx_routine_days_routine_id on public.routine_days(routine_id);

-- Routine Exercises
create index if not exists idx_routine_exercises_day_id on public.routine_exercises(routine_day_id);
create index if not exists idx_routine_exercises_sort_order on public.routine_exercises(routine_day_id, sort_order);

-- Workout Sessions (critical for stats queries)
create index if not exists idx_sessions_user_started on public.workout_sessions(user_id, started_at desc);
create index if not exists idx_sessions_ended_at on public.workout_sessions(ended_at) where ended_at is not null;
create index if not exists idx_sessions_routine_id on public.workout_sessions(routine_id) where routine_id is not null;

-- Workout Exercises
create index if not exists idx_workout_exercises_session_id on public.workout_exercises(session_id);

-- Workout Sets (critical for volume calculations)
create index if not exists idx_sets_exercise on public.workout_sets(workout_exercise_id);
create index if not exists idx_sets_completed_at on public.workout_sets(completed_at desc);

-- User Entitlements
create index if not exists idx_entitlements_user_id on public.user_entitlements(user_id);
create index if not exists idx_entitlements_pro on public.user_entitlements(pro) where pro = true;

