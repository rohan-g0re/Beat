/**
 * useEntitlements Hook - RevenueCat CustomerInfo refresh
 */

import { useEffect, useState } from 'react';
import { useEntitlementStore } from '@store/entitlementStore';
import { getCustomerInfo, checkProEntitlement } from '@services/monetization';
import { getUserEntitlement } from '@services/supabase';
import { useAuth } from './useAuth';

export const useEntitlements = () => {
  const { user } = useAuth();
  const { pro, maxRoutines, setEntitlement, setLoading } = useEntitlementStore();
  const [error, setError] = useState<string | null>(null);

  // Fetch entitlements on mount and when user changes
  useEffect(() => {
    if (!user) {
      setEntitlement(false, 2, null);
      return;
    }

    refreshEntitlements();
  }, [user]);

  const refreshEntitlements = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Try RevenueCat first (source of truth)
      const customerInfo = await getCustomerInfo();
      const isPro = await checkProEntitlement();

      if (customerInfo) {
        const expiresAt = customerInfo.entitlements.active['pro']?.expirationDate || null;
        setEntitlement(isPro, isPro ? 50 : 2, expiresAt);
      } else {
        // Fallback to database entitlement
        const { data, error: dbError } = await getUserEntitlement(user.id);

        if (dbError) {
          // No entitlement record yet, use defaults
          setEntitlement(false, 2, null);
        } else if (data) {
          setEntitlement(data.pro, data.max_routines, data.expires_at);
        }
      }
    } catch (err) {
      console.error('Failed to refresh entitlements:', err);
      setError('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };

  return {
    pro,
    maxRoutines,
    refreshEntitlements,
    error,
  };
};

