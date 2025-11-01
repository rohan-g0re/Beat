/**
 * useAuth Hook - Authentication state and actions
 */

import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, signInWithEmail, signUpWithEmail, signOut } from '@services/supabase';
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
    // Timeout fallback if Supabase takes too long (e.g., invalid credentials)
    const timeoutId = setTimeout(() => {
      console.warn('Auth initialization timed out - proceeding with bypass mode available');
      setAuthState(prev => ({
        ...prev,
        loading: false,
        initialized: true,
      }));
    }, 3000); // 3 second timeout

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
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

