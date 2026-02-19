/**
 * Smart Nudge Service — Context-Aware, Non-Intrusive Nudges
 * 
 * Rules-based nudge system:
 * - No mood logged today → soft reminder
 * - Streak about to break (logged yesterday but not today + evening) → encouragement
 * - Streak milestone reached → positive reinforcement
 * - Respects user inactivity (won't show if dismissed recently)
 */

import type { StreakData } from './streakService';

export interface Nudge {
    id: string;
    type: 'reminder' | 'encouragement' | 'celebration' | 'milestone';
    message: string;
    emoji: string;
    priority: number; // Higher = more important, show first
}

const NUDGE_DISMISS_KEY = 'innerhue-nudge-dismissed';

// Milestone thresholds for celebration nudges
const MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100];

function getLocalHour(): number {
    return new Date().getHours();
}

function isDismissedToday(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const dismissed = localStorage.getItem(NUDGE_DISMISS_KEY);
        if (!dismissed) return false;
        const today = new Date().toDateString();
        return dismissed === today;
    } catch {
        return false;
    }
}

export function dismissNudge(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NUDGE_DISMISS_KEY, new Date().toDateString());
}

/**
 * Generate context-aware nudges based on streak data.
 * Returns an array of nudges sorted by priority (highest first).
 * Returns empty array if nudges are dismissed or not applicable.
 */
export function generateNudges(streakData: StreakData, hasLoggedToday: boolean): Nudge[] {
    // Respect dismissal — user swiped away nudges for today
    if (isDismissedToday()) return [];

    const nudges: Nudge[] = [];
    const hour = getLocalHour();

    // 1. Streak milestone celebration (highest priority)
    if (hasLoggedToday && MILESTONES.includes(streakData.currentStreak)) {
        nudges.push({
            id: `milestone-${streakData.currentStreak}`,
            type: 'milestone',
            message: getMilestoneMessage(streakData.currentStreak),
            emoji: getMilestoneEmoji(streakData.currentStreak),
            priority: 100,
        });
    }

    // 2. Streak about to break — logged yesterday, not today, and it's afternoon/evening
    if (!hasLoggedToday && streakData.currentStreak > 0 && hour >= 14) {
        nudges.push({
            id: 'streak-warning',
            type: 'encouragement',
            message: `Your ${streakData.currentStreak}-day streak is still going! Take a moment to reflect before the day ends.`,
            emoji: '⏰',
            priority: 80,
        });
    }

    // 3. Gentle reminder if no mood logged today (only show from 10am onwards)
    if (!hasLoggedToday && hour >= 10) {
        const reminderMessages = [
            "How are you feeling right now? A quick check-in can make all the difference.",
            "Your emotions matter. Take a moment to acknowledge how you're feeling today.",
            "A small reflection today keeps emotional awareness growing.",
            "Pause, breathe, and check in with yourself. How's your inner world?",
        ];
        const msgIndex = new Date().getDate() % reminderMessages.length;

        nudges.push({
            id: 'daily-reminder',
            type: 'reminder',
            message: reminderMessages[msgIndex],
            emoji: '💭',
            priority: 40,
        });
    }

    // 4. Positive reinforcement after logging (show celebration briefly)
    if (hasLoggedToday && streakData.currentStreak > 1 && !MILESTONES.includes(streakData.currentStreak)) {
        nudges.push({
            id: 'positive-reinforcement',
            type: 'celebration',
            message: getStreakEncouragement(streakData.currentStreak),
            emoji: '🔥',
            priority: 60,
        });
    }

    // Sort by priority descending, return only the top nudge to avoid spam
    return nudges.sort((a, b) => b.priority - a.priority);
}

function getMilestoneMessage(streak: number): string {
    const messages: Record<number, string> = {
        3: "3 days of reflection! You're building a beautiful habit. 🌱",
        7: "One full week! Your emotional awareness is growing stronger each day. 🌟",
        14: "Two weeks of consistent reflection — that's real commitment to yourself! 💎",
        21: "21 days — they say that's what it takes to build a habit. Incredible! 🏆",
        30: "A full month of emotional check-ins! You're truly dedicated to self-growth. 🎉",
        50: "50 days! Half a century of daily reflections. That's extraordinary! 🌈",
        75: "75 days! You're a reflection champion. Your emotional intelligence is soaring! ⭐",
        100: "100 DAYS! An incredible milestone. You've transformed your emotional awareness! 🎊",
    };
    return messages[streak] || `Amazing! ${streak} days of reflection!`;
}

function getMilestoneEmoji(streak: number): string {
    if (streak >= 100) return '🎊';
    if (streak >= 50) return '🌈';
    if (streak >= 21) return '🏆';
    if (streak >= 7) return '🌟';
    return '🌱';
}

function getStreakEncouragement(streak: number): string {
    if (streak >= 30) return "You're on fire! Consistency is your superpower.";
    if (streak >= 14) return "Two weeks strong! Your dedication is inspiring.";
    if (streak >= 7) return "A full week of reflection! Keep the momentum going.";
    if (streak >= 3) return "You're building momentum! Every day counts.";
    return "Great job checking in today! Keep it going.";
}
