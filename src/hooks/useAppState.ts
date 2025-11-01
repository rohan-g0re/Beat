/**
 * useAppState Hook - AppState lifecycle tracking
 */

import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [lastActiveAt, setLastActiveAt] = useState<Date>(new Date());
  const [timeInBackground, setTimeInBackground] = useState<number>(0);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const wasInBackground =
        appState.current.match(/inactive|background/) && nextAppState === 'active';
      const wentToBackground =
        appState.current === 'active' && nextAppState.match(/inactive|background/);

      if (wasInBackground) {
        // App came to foreground
        const now = new Date();
        const backgroundDuration = now.getTime() - lastActiveAt.getTime();
        setTimeInBackground(backgroundDuration);
        setLastActiveAt(now);
      }

      if (wentToBackground) {
        // App went to background
        setLastActiveAt(new Date());
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [lastActiveAt]);

  return {
    appState: appStateVisible,
    isActive: appStateVisible === 'active',
    isBackground: appStateVisible === 'background',
    isInactive: appStateVisible === 'inactive',
    timeInBackground,
    lastActiveAt,
  };
};

