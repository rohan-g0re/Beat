-- =====================================================
-- Migration: 00001_initial_schema
-- Description: Core tables (profiles, routines, days, exercises)
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================
-- Profiles Table
-- =====================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  units text not null default 'metric' check (units in ('metric', 'imperial')),
  equipment jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'User profiles linked 1:1 with auth.users';
comment on column public.profiles.equipment is 'User''s available equipment (JSON array of strings)';

-- =====================================================
-- Routines Table
-- =====================================================

create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

comment on table public.routines is 'User workout routines';

-- =====================================================
-- Routine Days Table
-- =====================================================

create table if not exists public.routine_days (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (routine_id, day_of_week)
);

comment on table public.routine_days is 'Days within a routine (Mon-Sun)';
comment on column public.routine_days.day_of_week is '0=Sun, 1=Mon, ..., 6=Sat';
comment on column public.routine_days.tags is 'Muscle group tags (JSON array)';

-- =====================================================
-- Routine Exercises Table
-- =====================================================

create table if not exists public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_day_id uuid not null references public.routine_days(id) on delete cascade,
  name text not null,
  target_sets int,
  target_reps int,
  target_weight numeric,
  notes text,
  sort_order int not null default 0
);

comment on table public.routine_exercises is 'Exercises planned for a routine day';
comment on column public.routine_exercises.sort_order is 'Display order within the day';

