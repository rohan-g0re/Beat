/**
 * Entitlement Store - RevenueCat subscription status
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EntitlementState {
  pro: boolean;
  maxRoutines: number;
  expiresAt: string | null;
  fetchedAt: string | null;
  isLoading: boolean;

  // Actions
  setEntitlement: (pro: boolean, maxRoutines: number, expiresAt?: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearEntitlement: () => void;

  // Computed
  isProActive: () => boolean;
  canCreateRoutine: (currentCount: number) => boolean;
}

export const useEntitlementStore = create<EntitlementState>()(
  persist(
    (set, get) => ({
      pro: false,
      maxRoutines: 2,
      expiresAt: null,
      fetchedAt: null,
      isLoading: false,

      setEntitlement: (pro, maxRoutines, expiresAt = null) => {
        set({
          pro,
          maxRoutines,
          expiresAt,
          fetchedAt: new Date().toISOString(),
        });
      },

      setLoading: isLoading => set({ isLoading }),

      clearEntitlement: () => {
        set({
          pro: false,
          maxRoutines: 2,
          expiresAt: null,
          fetchedAt: null,
        });
      },

      isProActive: () => {
        const { pro, expiresAt } = get();
        if (!pro) return false;
        if (!expiresAt) return true;
        return new Date(expiresAt) > new Date();
      },

      canCreateRoutine: currentCount => {
        const { maxRoutines } = get();
        return currentCount < maxRoutines;
      },
    }),
    {
      name: 'entitlement-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

