-- =====================================================
-- Migration: 00004_rls_policies
-- Description: Row-Level Security policies
-- =====================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.routines enable row level security;
alter table public.routine_days enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_sets enable row level security;
alter table public.user_entitlements enable row level security;

-- =====================================================
-- Profiles Policies
-- =====================================================

create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

-- =====================================================
-- User Entitlements Policies
-- =====================================================

create policy "Users can read own entitlements"
  on public.user_entitlements for select
  using (user_id = auth.uid());

create policy "Users can update own entitlements"
  on public.user_entitlements for update
  using (user_id = auth.uid());

create policy "Users can insert own entitlements"
  on public.user_entitlements for insert
  with check (user_id = auth.uid());

-- =====================================================
-- Routines Policies (with capacity check)
-- =====================================================

create policy "Users can read own routines"
  on public.routines for select
  using (user_id = auth.uid());

create policy "Users can update own routines"
  on public.routines for update
  using (user_id = auth.uid());

create policy "Users can delete own routines"
  on public.routines for delete
  using (user_id = auth.uid());

create policy "Users can insert routines within cap"
  on public.routines for insert
  with check (
    user_id = auth.uid() 
    and (
      -- Allow if pro or under max_routines limit
      exists (
        select 1 from public.user_entitlements e
        where e.user_id = auth.uid() 
        and (
          e.pro = true 
          or (select count(*) from public.routines where user_id = auth.uid()) < e.max_routines
        )
      )
      -- Or if no entitlement record exists yet (bootstrap: allow up to 2)
      or (
        not exists (select 1 from public.user_entitlements where user_id = auth.uid())
        and (select count(*) from public.routines where user_id = auth.uid()) < 2
      )
    )
  );

-- =====================================================
-- Routine Days Policies
-- =====================================================

create policy "Users can manage own routine days"
  on public.routine_days for all
  using (
    exists (
      select 1 from public.routines r 
      where r.id = routine_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.routines r 
      where r.id = routine_id and r.user_id = auth.uid()
    )
  );

-- =====================================================
-- Routine Exercises Policies
-- =====================================================

create policy "Users can manage own routine exercises"
  on public.routine_exercises for all
  using (
    exists (
      select 1 from public.routine_days d 
      join public.routines r on r.id = d.routine_id
      where d.id = routine_day_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.routine_days d 
      join public.routines r on r.id = d.routine_id
      where d.id = routine_day_id and r.user_id = auth.uid()
    )
  );

-- =====================================================
-- Workout Sessions Policies
-- =====================================================

create policy "Users can manage own sessions"
  on public.workout_sessions for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- =====================================================
-- Workout Exercises Policies
-- =====================================================

create policy "Users can manage own workout exercises"
  on public.workout_exercises for all
  using (
    exists (
      select 1 from public.workout_sessions s 
      where s.id = session_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workout_sessions s 
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

-- =====================================================
-- Workout Sets Policies
-- =====================================================

create policy "Users can manage own workout sets"
  on public.workout_sets for all
  using (
    exists (
      select 1 from public.workout_exercises e 
      join public.workout_sessions s on s.id = e.session_id
      where e.id = workout_exercise_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workout_exercises e 
      join public.workout_sessions s on s.id = e.session_id
      where e.id = workout_exercise_id and s.user_id = auth.uid()
    )
  );

