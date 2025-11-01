/**
 * Workout Store - Active session state and timer management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession, WorkoutExercise, WorkoutSet } from '@types/models';

interface ActiveWorkout {
  sessionId: string;
  startedAt: string;
  currentExerciseId: string | null;
  exercises: WorkoutExercise[];
  isPaused: boolean;
  pausedAt: string | null;
}

interface WorkoutState {
  activeSession: ActiveWorkout | null;
  isKeepAwake: boolean;

  // Actions
  startWorkout: (
    sessionId: string,
    routineId?: string,
    dayId?: string,
    exercises?: WorkoutExercise[]
  ) => void;
  endWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  setCurrentExercise: (exerciseId: string | null) => void;
  addSet: (exerciseId: string, set: WorkoutSet) => void;
  updateExercises: (exercises: WorkoutExercise[]) => void;
  clearWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      isKeepAwake: false,

      startWorkout: (sessionId, routineId, dayId, exercises = []) => {
        set({
          activeSession: {
            sessionId,
            startedAt: new Date().toISOString(),
            currentExerciseId: exercises[0]?.id || null,
            exercises,
            isPaused: false,
            pausedAt: null,
          },
          isKeepAwake: true,
        });
      },

      endWorkout: () => {
        set({
          activeSession: null,
          isKeepAwake: false,
        });
      },

      pauseWorkout: () => {
        const { activeSession } = get();
        if (activeSession) {
          set({
            activeSession: {
              ...activeSession,
              isPaused: true,
              pausedAt: new Date().toISOString(),
            },
          });
        }
      },

      resumeWorkout: () => {
        const { activeSession } = get();
        if (activeSession) {
          set({
            activeSession: {
              ...activeSession,
              isPaused: false,
              pausedAt: null,
            },
          });
        }
      },

      setCurrentExercise: exerciseId => {
        const { activeSession } = get();
        if (activeSession) {
          set({
            activeSession: {
              ...activeSession,
              currentExerciseId: exerciseId,
            },
          });
        }
      },

      addSet: (exerciseId, set) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const exercises = activeSession.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: [...(ex.sets || []), set],
            };
          }
          return ex;
        });

        set({
          activeSession: {
            ...activeSession,
            exercises,
          },
        });
      },

      updateExercises: exercises => {
        const { activeSession } = get();
        if (activeSession) {
          set({
            activeSession: {
              ...activeSession,
              exercises,
            },
          });
        }
      },

      clearWorkout: () => {
        set({
          activeSession: null,
          isKeepAwake: false,
        });
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        activeSession: state.activeSession,
      }),
    }
  )
);

