/**
 * App-level TypeScript interfaces and types
 */

export interface Profile {
  id: string;
  email: string | null;
  displayName: string | null;
  units: 'metric' | 'imperial';
  equipment: string[];
  createdAt: string;
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  days?: RoutineDay[];
}

export interface RoutineDay {
  id: string;
  routineId: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  tags: string[];
  createdAt: string;
  exercises?: RoutineExercise[];
}

export interface RoutineExercise {
  id: string;
  routineDayId: string;
  name: string;
  targetSets: number | null;
  targetReps: number | null;
  targetWeight: number | null;
  notes: string | null;
  sortOrder: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  routineId: string | null;
  routineDayId: string | null;
  startedAt: string;
  endedAt: string | null;
  totalDurationSec: number | null;
  strengthScore: number | null;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  sessionId: string;
  name: string;
  sortOrder: number;
  sets?: WorkoutSet[];
}

export interface WorkoutSet {
  id: string;
  workoutExerciseId: string;
  setNumber: number;
  reps: number;
  weight: number | null;
  rir: number | null; // Reps in Reserve
  completedAt: string;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  defaultRepMin: number | null;
  defaultRepMax: number | null;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  movementPattern?: string;
}

export interface UserEntitlement {
  userId: string;
  pro: boolean;
  maxRoutines: number;
  expiresAt: string | null;
  updatedAt: string;
}

// Stats & Analytics
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
}

export interface WorkoutStats {
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  totalDuration: number;
  strengthScore: number;
}

export interface ActivityDay {
  date: string;
  sessionCount: number;
  hasWorkout: boolean;
}

// UI State Types
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

