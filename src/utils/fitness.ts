/**
 * Fitness Utilities - Exercise suggestions scorer and strength calculations
 */

import { ExerciseTemplate, WorkoutSet } from '@types/models';
import exerciseTemplates from '@data/exerciseTemplates.json';

// ==================== Exercise Suggestion Algorithm ====================

interface SuggestionContext {
  dayTags: string[]; // Muscle groups targeted for the day
  equipment: string[]; // User's available equipment
  existingExercises: string[]; // Already added exercise names
  recentVolume?: Record<string, number>; // Recent volume by muscle group (last 7 days)
}

interface ScoredExercise {
  exercise: ExerciseTemplate;
  score: number;
  reason: string;
}

/**
 * Deterministic on-device exercise suggestion scorer
 * Returns top 5 exercises based on tags, equipment, diversity, and fatigue
 */
export const suggestExercises = (context: SuggestionContext): ExerciseTemplate[] => {
  const { dayTags, equipment, existingExercises, recentVolume = {} } = context;

  // Filter exercises by available equipment
  const availableExercises = (exerciseTemplates as ExerciseTemplate[]).filter(ex => {
    // Check if user has required equipment
    return ex.equipment.some(eq => equipment.includes(eq) || eq === 'Bodyweight');
  });

  // Score each exercise
  const scoredExercises: ScoredExercise[] = availableExercises.map(exercise => {
    let score = 0;
    const reasons: string[] = [];

    // Already added - exclude
    if (existingExercises.includes(exercise.name)) {
      return { exercise, score: -1000, reason: 'Already added' };
    }

    // Primary muscle match (high weight)
    const primaryMatches = exercise.primaryMuscles.filter(muscle => dayTags.includes(muscle));
    score += primaryMatches.length * 3;
    if (primaryMatches.length > 0) {
      reasons.push(`Targets ${primaryMatches.join(', ')}`);
    }

    // Secondary muscle match (low weight)
    const secondaryMatches = exercise.secondaryMuscles.filter(muscle => dayTags.includes(muscle));
    score += secondaryMatches.length * 1;

    // No muscle match at all - penalize heavily
    if (primaryMatches.length === 0 && secondaryMatches.length === 0) {
      score -= 5;
      reasons.push('Low relevance');
    }

    // Diversity penalty - check for movement pattern diversity
    const existingPatterns = availableExercises
      .filter(ex => existingExercises.includes(ex.name))
      .map(ex => ex.movementPattern);

    if (exercise.movementPattern && existingPatterns.includes(exercise.movementPattern)) {
      score -= 2;
      reasons.push('Similar movement pattern');
    }

    // Fatigue penalty - if muscle group has high recent volume
    const fatiguePenalty = exercise.primaryMuscles.reduce((penalty, muscle) => {
      const volume = recentVolume[muscle] || 0;
      if (volume > 5000) return penalty + 2; // High fatigue
      if (volume > 3000) return penalty + 1; // Moderate fatigue
      return penalty;
    }, 0);

    score -= fatiguePenalty;
    if (fatiguePenalty > 0) {
      reasons.push('Muscle group fatigued');
    }

    // Beginner-friendly bonus (slightly favor easier exercises)
    if (exercise.difficulty === 'beginner') {
      score += 0.5;
    }

    return {
      exercise,
      score,
      reason: reasons.join(', ') || 'Good match',
    };
  });

  // Sort by score and take top 5
  const topExercises = scoredExercises
    .filter(item => item.score > -100) // Exclude heavily penalized
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.exercise);

  return topExercises;
};

// ==================== Strength Score Calculations ====================

/**
 * Calculate strength score for a workout session (Option A: Volume-based)
 * Score = sum of (weight × reps) for all sets
 */
export const calculateStrengthScore = (sets: WorkoutSet[]): number => {
  return sets.reduce((total, set) => {
    const weight = set.weight || 0;
    const reps = set.reps || 0;
    return total + weight * reps;
  }, 0);
};

/**
 * Calculate 1RM estimate using Epley formula
 * 1RM = weight × (1 + reps / 30)
 */
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
};

/**
 * Calculate 1RM estimate using Brzycki formula
 * 1RM = weight × (36 / (37 - reps))
 */
export const calculate1RMBrzycki = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  if (reps >= 37) return weight * 2; // Cap for high reps
  return weight * (36 / (37 - reps));
};

/**
 * Calculate total volume for a workout
 * Volume = sum of (weight × reps)
 */
export const calculateTotalVolume = (sets: WorkoutSet[]): number => {
  return sets.reduce((total, set) => {
    return total + (set.weight || 0) * (set.reps || 0);
  }, 0);
};

/**
 * Calculate total reps for a workout
 */
export const calculateTotalReps = (sets: WorkoutSet[]): number => {
  return sets.reduce((total, set) => total + (set.reps || 0), 0);
};

/**
 * Calculate average RIR (Reps in Reserve) for a workout
 */
export const calculateAverageRIR = (sets: WorkoutSet[]): number => {
  const setsWithRIR = sets.filter(set => set.rir !== null && set.rir !== undefined);
  if (setsWithRIR.length === 0) return 0;

  const totalRIR = setsWithRIR.reduce((sum, set) => sum + (set.rir || 0), 0);
  return totalRIR / setsWithRIR.length;
};

/**
 * Calculate exponential moving average for smoothing strength score
 */
export const calculateEMA = (values: number[], period: number = 7): number[] => {
  if (values.length === 0) return [];

  const alpha = 2 / (period + 1);
  const ema: number[] = [values[0]];

  for (let i = 1; i < values.length; i++) {
    ema.push(alpha * values[i] + (1 - alpha) * ema[i - 1]);
  }

  return ema;
};

// ==================== Exercise Catalog Utilities ====================

/**
 * Get all exercises for a specific muscle group
 */
export const getExercisesByMuscle = (muscleGroup: string): ExerciseTemplate[] => {
  return (exerciseTemplates as ExerciseTemplate[]).filter(
    ex =>
      ex.primaryMuscles.includes(muscleGroup) || ex.secondaryMuscles.includes(muscleGroup)
  );
};

/**
 * Get all exercises for specific equipment
 */
export const getExercisesByEquipment = (equipment: string[]): ExerciseTemplate[] => {
  return (exerciseTemplates as ExerciseTemplate[]).filter(ex =>
    ex.equipment.some(eq => equipment.includes(eq) || eq === 'Bodyweight')
  );
};

/**
 * Search exercises by name
 */
export const searchExercises = (query: string): ExerciseTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return (exerciseTemplates as ExerciseTemplate[]).filter(ex =>
    ex.name.toLowerCase().includes(lowerQuery)
  );
};

