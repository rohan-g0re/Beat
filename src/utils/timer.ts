/**
 * Timer Utilities - Monotonic time calculations (AppState-safe)
 */

/**
 * Calculate elapsed time from a start timestamp
 * Uses current time minus start time for accuracy (not setInterval)
 */
export const calculateElapsedTime = (startedAt: string, pausedAt?: string | null): number => {
  const startTime = new Date(startedAt).getTime();
  const endTime = pausedAt ? new Date(pausedAt).getTime() : Date.now();
  return Math.max(0, endTime - startTime);
};

/**
 * Calculate total elapsed time accounting for pause periods
 */
export const calculateElapsedTimeWithPauses = (
  startedAt: string,
  pausePeriods: Array<{ pausedAt: string; resumedAt: string }>
): number => {
  const startTime = new Date(startedAt).getTime();
  const now = Date.now();
  
  // Calculate total pause duration
  const totalPauseDuration = pausePeriods.reduce((total, period) => {
    const pauseStart = new Date(period.pausedAt).getTime();
    const pauseEnd = new Date(period.resumedAt).getTime();
    return total + (pauseEnd - pauseStart);
  }, 0);

  const totalElapsed = now - startTime;
  return Math.max(0, totalElapsed - totalPauseDuration);
};

/**
 * Format milliseconds to MM:SS or HH:MM:SS
 */
export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Format duration to human-readable string (e.g., "1h 23m")
 */
export const formatDurationHuman = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
};

/**
 * Calculate rest time between sets
 */
export const calculateRestTime = (lastSetCompletedAt: string): number => {
  const lastSetTime = new Date(lastSetCompletedAt).getTime();
  const now = Date.now();
  return Math.max(0, now - lastSetTime);
};

/**
 * Check if rest time target has been reached
 */
export const hasReachedRestTarget = (
  lastSetCompletedAt: string,
  targetRestSeconds: number
): boolean => {
  const restTime = calculateRestTime(lastSetCompletedAt);
  return restTime >= targetRestSeconds * 1000;
};

/**
 * Get recommended rest time based on exercise type and intensity
 */
export const getRecommendedRestTime = (
  reps: number,
  rir: number | null
): number => {
  // Low reps (1-5) and low RIR (0-1) = heavy strength work → 3-5 min
  if (reps <= 5 && (rir === null || rir <= 1)) {
    return 180; // 3 minutes
  }

  // Medium reps (6-12) = hypertrophy → 1-2 min
  if (reps <= 12) {
    return 90; // 1.5 minutes
  }

  // High reps (13+) = endurance/pump → 30-60 sec
  return 60; // 1 minute
};

/**
 * Convert seconds to ISO timestamp string
 */
export const secondsToISO = (seconds: number): string => {
  return new Date(Date.now() + seconds * 1000).toISOString();
};

/**
 * Get timestamp for "now"
 */
export const now = (): string => {
  return new Date().toISOString();
};

