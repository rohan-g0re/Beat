-- =====================================================
-- Migration: 00003_entitlements
-- Description: User entitlements for monetization
-- =====================================================

-- =====================================================
-- User Entitlements Table
-- =====================================================

create table if not exists public.user_entitlements (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  pro boolean not null default false,
  max_routines int not null default 2,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.user_entitlements is 'Subscription entitlements mirrored from RevenueCat';
comment on column public.user_entitlements.pro is 'Pro subscription active';
comment on column public.user_entitlements.max_routines is 'Maximum routines allowed (2 free, 50 pro)';
comment on column public.user_entitlements.expires_at is 'Subscription expiration (null = lifetime)';

