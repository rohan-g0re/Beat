/**
 * useWorkoutTimer Hook - Timer logic with AppState handling
 */

import { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useWorkoutStore } from '@store/workoutStore';
import { calculateElapsedTime, formatDuration } from '@utils/timer';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

export const useWorkoutTimer = () => {
  const { activeSession, isKeepAwake } = useWorkoutStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState('00:00');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  // Update timer every second
  useEffect(() => {
    if (!activeSession || activeSession.isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const updateTimer = () => {
      const elapsed = calculateElapsedTime(
        activeSession.startedAt,
        activeSession.isPaused ? activeSession.pausedAt : null
      );
      setElapsedTime(elapsed);
      setFormattedTime(formatDuration(elapsed));
    };

    // Initial update
    updateTimer();

    // Update every second
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSession]);

  // Handle AppState changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground - recalculate elapsed time
        if (activeSession && !activeSession.isPaused) {
          const elapsed = calculateElapsedTime(activeSession.startedAt);
          setElapsedTime(elapsed);
          setFormattedTime(formatDuration(elapsed));
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [activeSession]);

  // Manage keep-awake
  useEffect(() => {
    if (isKeepAwake && activeSession && !activeSession.isPaused) {
      activateKeepAwakeAsync('workout-timer').catch(console.error);
    } else {
      deactivateKeepAwake('workout-timer').catch(console.error);
    }

    return () => {
      deactivateKeepAwake('workout-timer').catch(console.error);
    };
  }, [isKeepAwake, activeSession]);

  return {
    elapsedTime,
    formattedTime,
    isRunning: !!activeSession && !activeSession.isPaused,
  };
};

