/**
 * Streak Service — Mood Reflection Streak Calculator
 * 
 * A streak = at least one mood logged per calendar day.
 * Streak resets if a full calendar day is missed.
 * Only one streak increment per calendar day (prevents duplicates on repeated visits).
 */

export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastLoggedDate: string | null; // ISO date string (YYYY-MM-DD)
    streakDates: string[];          // Array of ISO date strings where moods were logged
}

const STREAK_STORAGE_KEY = 'innerhue-streak-data';

// Timezone-safe: get local calendar date as YYYY-MM-DD
function getLocalDateString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Calculate difference in calendar days between two YYYY-MM-DD strings
function daysBetween(dateA: string, dateB: string): number {
    const a = new Date(dateA + 'T00:00:00');
    const b = new Date(dateB + 'T00:00:00');
    const diffMs = Math.abs(a.getTime() - b.getTime());
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function getDefaultStreakData(): StreakData {
    return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoggedDate: null,
        streakDates: [],
    };
}

/** Load persisted streak data from localStorage */
export function loadStreakData(): StreakData {
    if (typeof window === 'undefined') return getDefaultStreakData();

    try {
        const raw = localStorage.getItem(STREAK_STORAGE_KEY);
        if (!raw) return getDefaultStreakData();
        const parsed = JSON.parse(raw) as StreakData;
        return {
            currentStreak: parsed.currentStreak ?? 0,
            longestStreak: parsed.longestStreak ?? 0,
            lastLoggedDate: parsed.lastLoggedDate ?? null,
            streakDates: parsed.streakDates ?? [],
        };
    } catch {
        return getDefaultStreakData();
    }
}

/** Save streak data to localStorage */
export function saveStreakData(data: StreakData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Record today's mood reflection in the streak.
 * Only increments once per calendar day.
 * Returns the updated StreakData.
 */
export function recordDailyStreak(): StreakData {
    const data = loadStreakData();
    const today = getLocalDateString();

    // Already logged today — no duplicate increment
    if (data.lastLoggedDate === today) {
        return data;
    }

    // Determine if streak continues or resets
    if (data.lastLoggedDate) {
        const gap = daysBetween(data.lastLoggedDate, today);
        if (gap === 1) {
            // Consecutive day — continue streak
            data.currentStreak += 1;
        } else if (gap === 0) {
            // Same day (shouldn't reach here due to early return, but safety)
            return data;
        } else {
            // Missed day(s) — reset streak
            data.currentStreak = 1;
        }
    } else {
        // First ever log
        data.currentStreak = 1;
    }

    // Update longest streak
    if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak;
    }

    // Record the date
    data.lastLoggedDate = today;
    if (!data.streakDates.includes(today)) {
        data.streakDates.push(today);
    }

    // Keep only last 90 days of streak dates to limit storage
    if (data.streakDates.length > 90) {
        data.streakDates = data.streakDates.slice(-90);
    }

    saveStreakData(data);
    return data;
}

/**
 * Recalculate streak from mood history entries.
 * Useful after hydration or initial load.
 */
export function recalculateStreakFromHistory(
    moodHistory: Array<{ timestamp: string }>
): StreakData {
    if (!moodHistory || moodHistory.length === 0) {
        return getDefaultStreakData();
    }

    // Extract unique calendar dates from mood history
    const uniqueDates = Array.from(
        new Set(
            moodHistory.map(entry => getLocalDateString(new Date(entry.timestamp)))
        )
    ).sort();

    if (uniqueDates.length === 0) return getDefaultStreakData();

    // Walk backwards from most recent date to count current streak
    const today = getLocalDateString();
    const lastDate = uniqueDates[uniqueDates.length - 1];

    // If last logged date is more than 1 day before today, streak is broken
    const gapFromToday = daysBetween(lastDate, today);

    let currentStreak = 0;
    if (gapFromToday <= 1) {
        // Streak is still active (logged today or yesterday)
        currentStreak = 1;
        for (let i = uniqueDates.length - 2; i >= 0; i--) {
            const gap = daysBetween(uniqueDates[i], uniqueDates[i + 1]);
            if (gap === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Find longest streak across all history
    let longestStreak = 1;
    let tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
        const gap = daysBetween(uniqueDates[i - 1], uniqueDates[i]);
        if (gap === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    const data: StreakData = {
        currentStreak,
        longestStreak,
        lastLoggedDate: lastDate,
        streakDates: uniqueDates.slice(-90),
    };

    saveStreakData(data);
    return data;
}

/** Check if mood was already logged today */
export function hasLoggedToday(): boolean {
    const data = loadStreakData();
    return data.lastLoggedDate === getLocalDateString();
}

/** Get the current local date string for external use */
export function getTodayString(): string {
    return getLocalDateString();
}
