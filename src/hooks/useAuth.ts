/**
 * useAuth Hook - Authentication state and actions
 */

import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, signInWithEmail, signUpWithEmail, signOut, upsertProfile } from '@services/supabase';
import { initializePurchases, signOutPurchases } from '@services/monetization';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  bypass: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
    bypass: false,
  });

  useEffect(() => {
    // Timeout fallback if Supabase takes too long (e.g., network issues)
    const timeoutId = setTimeout(() => {
      console.warn('Auth initialization timed out - check network connection or Supabase credentials');
      setAuthState(prev => ({
        ...prev,
        loading: false,
        initialized: true,
      }));
    }, 5000); // 5 second timeout

    // Get initial session
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        clearTimeout(timeoutId);
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          initialized: true,
          bypass: false,
        });

        // Initialize RevenueCat if user is signed in
        if (session?.user) {
          initializePurchases(session.user.id).catch(console.error);
          // Ensure profile exists (FK requirement for routines.user_id → profiles.id)
          try {
            await upsertProfile({
              id: session.user.id,
              email: session.user.email ?? null,
              display_name: (session.user.user_metadata as any)?.name ?? null,
              // units/equipment defaulted by DB
            } as any);
          } catch (e) {
            console.error('Profile upsert failed:', e);
          }
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('Auth initialization failed:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          initialized: true,
        }));
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session,
        loading: false,
        bypass: false,
      }));

      // Initialize RevenueCat on sign in
      if (session?.user) {
        initializePurchases(session.user.id).catch(console.error);
        // Ensure profile exists as soon as we have a session
        upsertProfile({
          id: session.user.id,
          email: session.user.email ?? null,
          display_name: (session.user.user_metadata as any)?.name ?? null,
        } as any).catch(err => console.error('Profile upsert failed:', err));
      } else {
        // Sign out from RevenueCat
        signOutPurchases().catch(console.error);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, bypass: false }));
    const { data, error } = await signInWithEmail(email, password);
    setAuthState(prev => ({ ...prev, loading: false }));
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, bypass: false }));
    const { data, error } = await signUpWithEmail(email, password);
    setAuthState(prev => ({ ...prev, loading: false }));
    return { data, error };
  };

  const logOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const { error } = await signOut();
    setAuthState(prev => ({
      ...prev,
      user: null,
      session: null,
      loading: false,
      bypass: false,
    }));
    return { error };
  };

  const developerBypass = () => {
    setAuthState(prev => ({
      ...prev,
      loading: false,
      initialized: true,
      bypass: true,
    }));
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    initialized: authState.initialized,
    signIn,
    signUp,
    signOut: logOut,
    developerBypass,
    isAuthenticated: !!authState.user || authState.bypass,
  };
};

