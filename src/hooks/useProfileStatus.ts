/**
 * useProfileStatus Hook - Check if user profile is complete
 */

import { useEffect, useState } from 'react';
import { getProfile } from '@services/supabase';

interface ProfileStatus {
  loading: boolean;
  isComplete: boolean;
  profileData: any | null;
}

/**
 * Checks if user profile has completed onboarding
 * Profile is considered complete if it has height, weight, and at least one equipment item
 * Automatically rechecks every 2 seconds when profile is incomplete to detect updates
 */
export const useProfileStatus = (userId: string | null) => {
  const [status, setStatus] = useState<ProfileStatus>({
    loading: true,
    isComplete: false,
    profileData: null,
  });

  useEffect(() => {
    if (!userId) {
      setStatus({ loading: false, isComplete: false, profileData: null });
      return;
    }

    const checkProfile = async () => {
      try {
        const { data, error } = await getProfile(userId);
        
        if (error) {
          console.error('Failed to load profile:', error);
          setStatus((prev) => ({ ...prev, loading: false }));
          return;
        }

        if (data) {
          // Profile is complete if user has entered height, weight, and selected equipment
          const isComplete = 
            data.height !== null && 
            data.weight !== null && 
            Array.isArray(data.equipment) && 
            data.equipment.length > 0;

          setStatus({ loading: false, isComplete, profileData: data });
        } else {
          setStatus({ loading: false, isComplete: false, profileData: null });
        }
      } catch (error) {
        console.error('Profile check error:', error);
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    // Initial check
    checkProfile();

    // Set up polling interval to recheck profile status
    // This allows automatic navigation after profile completion
    const intervalId = setInterval(() => {
      checkProfile();
    }, 2000); // Check every 2 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [userId]);

  return status;
};

