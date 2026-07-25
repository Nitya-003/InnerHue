/**
 * Date and countdown helper functions for Emotional Memory Capsules.
 */

export interface CountdownTime {
  isUnlocked: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

/**
 * Calculates remaining time until unlockDateIso.
 * Returns formatted string like "12 days 4 hours 18 minutes 20 seconds" or "Unlocked".
 */
export function calculateCountdown(unlockDateIso: string): CountdownTime {
  if (!unlockDateIso) {
    return { isUnlocked: false, days: 0, hours: 0, minutes: 0, seconds: 0, formatted: 'Invalid date' };
  }

  const targetTime = new Date(unlockDateIso).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (isNaN(targetTime) || diff <= 0) {
    return { isUnlocked: true, days: 0, hours: 0, minutes: 0, seconds: 0, formatted: 'Unlocked' };
  }

  const secondsTotal = Math.floor(diff / 1000);
  const days = Math.floor(secondsTotal / (3600 * 24));
  const hours = Math.floor((secondsTotal % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours > 0 || days > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);

  return {
    isUnlocked: false,
    days,
    hours,
    minutes,
    seconds,
    formatted: parts.join(' '),
  };
}

/**
 * Formats ISO date string to readable format e.g. "Jul 25, 2026".
 */
export function formatDisplayDate(dateIso: string): string {
  if (!dateIso) return '';
  const date = new Date(dateIso);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats ISO date string to full date and time e.g. "Jul 25, 2026 at 8:00 PM".
 */
export function formatDateTime(dateIso: string): string {
  if (!dateIso) return '';
  const date = new Date(dateIso);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Validates if the date string/object is in the future.
 */
export function isFutureDate(dateIsoOrObj: string | Date): boolean {
  const date = new Date(dateIsoOrObj);
  return !isNaN(date.getTime()) && date.getTime() > Date.now();
}

/**
 * Generates an ISO string for quick unlock date presets (+1d, +1w, +1m, +6m, +1y).
 */
export function getPresetUnlockDate(preset: '1d' | '1w' | '1m' | '6m' | '1y'): string {
  const now = new Date();
  switch (preset) {
    case '1d':
      now.setDate(now.getDate() + 1);
      break;
    case '1w':
      now.setDate(now.getDate() + 7);
      break;
    case '1m':
      now.setMonth(now.getMonth() + 1);
      break;
    case '6m':
      now.setMonth(now.getMonth() + 6);
      break;
    case '1y':
      now.setFullYear(now.getFullYear() + 1);
      break;
  }
  return now.toISOString();
}
