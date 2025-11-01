/**
 * Validation utilities using Zod schemas
 */

import { z } from 'zod';

// ==================== Auth Schemas ====================

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ==================== Profile Schemas ====================

export const profileSchema = z.object({
  displayName: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  units: z.enum(['metric', 'imperial']),
  equipment: z.array(z.string()),
});

// ==================== Routine Schemas ====================

export const routineSchema = z.object({
  name: z.string().min(1, 'Routine name is required').max(50, 'Name too long'),
});

export const routineDaySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  tags: z.array(z.string()),
});

export const routineExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  targetSets: z.number().int().positive().nullable(),
  targetReps: z.number().int().positive().nullable(),
  targetWeight: z.number().positive().nullable(),
  notes: z.string().max(200, 'Notes too long').nullable(),
  sortOrder: z.number().int().min(0),
});

// ==================== Workout Schemas ====================

export const workoutSetSchema = z.object({
  reps: z.number().int().positive('Reps must be positive').max(999, 'Reps too high'),
  weight: z.number().min(0, 'Weight must be positive').max(9999, 'Weight too high').nullable(),
  rir: z
    .number()
    .int()
    .min(0, 'RIR must be 0 or positive')
    .max(10, 'RIR must be 10 or less')
    .nullable(),
});

// ==================== Type Exports ====================

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type RoutineFormData = z.infer<typeof routineSchema>;
export type RoutineDayFormData = z.infer<typeof routineDaySchema>;
export type RoutineExerciseFormData = z.infer<typeof routineExerciseSchema>;
export type WorkoutSetFormData = z.infer<typeof workoutSetSchema>;

// ==================== Validation Helpers ====================

export const validateEmail = (email: string): boolean => {
  try {
    z.string().email().parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validateWeight = (weight: number, units: 'metric' | 'imperial'): boolean => {
  const maxWeight = units === 'metric' ? 500 : 1000; // kg or lbs
  return weight >= 0 && weight <= maxWeight;
};

export const validateReps = (reps: number): boolean => {
  return reps > 0 && reps <= 999;
};

export const validateRIR = (rir: number): boolean => {
  return rir >= 0 && rir <= 10;
};

