'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Calendar, X, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import {
    loadStreakData,
    recordDailyStreak,
    recalculateStreakFromHistory,
    hasLoggedToday as checkLoggedToday,
    type StreakData,
} from '@/lib/streakService';
import {
    generateNudges,
    dismissNudge,
    type Nudge,
} from '@/lib/nudgeService';
import { useMoodStore, type MoodEntry } from '@/lib/useMoodStore';

/* ─── Streak Nav Icon (Navbar Button) ─── */
export function StreakNavIcon() {
    const [streakData, setStreakData] = useState<StreakData | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const moodHistory = useMoodStore((s) => s.moodHistory);

    // On mount: recalculate streak from mood history & auto-record today's visit
    useEffect(() => {
        if (moodHistory.length > 0) {
            recalculateStreakFromHistory(moodHistory);
        }

        // Auto-record daily streak on page load (once per calendar day)
        const updated = recordDailyStreak();
        setStreakData(updated);
    }, [moodHistory]);

    if (!streakData) return null;

    return (
        <>
            {/* Nav Icon Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsDetailOpen(true)}
                className="relative p-2 rounded-full bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 border border-white/10 flex items-center gap-1.5"
                title="Reflection Streak"
                aria-label={`Reflection Streak: ${streakData.currentStreak} days`}
            >
                <motion.div
                    animate={
                        streakData.currentStreak > 0
                            ? { scale: [1, 1.15, 1] }
                            : {}
                    }
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Flame
                        className={`w-5 h-5 md:w-6 md:h-6 ${streakData.currentStreak > 0 ? 'text-orange-400' : 'text-white'
                            }`}
                    />
                </motion.div>

                {/* Streak count badge */}
                {streakData.currentStreak > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 flex items-center justify-center px-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-[10px] font-bold text-white shadow-lg shadow-orange-500/30"
                    >
                        {streakData.currentStreak}
                    </motion.span>
                )}
            </motion.button>

            {/* Detail Modal */}
            <AnimatePresence>
                {isDetailOpen && (
                    <StreakDetailModal
                        streakData={streakData}
                        moodHistory={moodHistory}
                        onClose={() => setIsDetailOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

/* ─── Expanded Streak Detail Modal ─── */
function StreakDetailModal({
    streakData,
    moodHistory,
    onClose,
}: {
    streakData: StreakData;
    moodHistory: MoodEntry[];
    onClose: () => void;
}) {
    const [nudges, setNudges] = useState<Nudge[]>([]);
    const [showNudge, setShowNudge] = useState(true);

    useEffect(() => {
        const logged = checkLoggedToday();
        const nudgeList = generateNudges(streakData, logged);
        setNudges(nudgeList);
    }, [streakData]);

    const handleDismissNudge = () => {
        dismissNudge();
        setShowNudge(false);
    };

    const topNudge = nudges.length > 0 && showNudge ? nudges[0] : null;

    // Mood data enrichment: map mood ID to emoji/label
    const moodMap: Record<string, { emoji: string; label: string; color: string }> = useMemo(() => {
        const map: Record<string, { emoji: string; label: string; color: string }> = {};
        const defaultMoods: Record<string, { emoji: string; name: string; color: string }> = {
            happy: { emoji: '😊', name: 'Happy', color: '#FFD93D' },
            sad: { emoji: '😢', name: 'Sad', color: '#42A5F5' },
            anxious: { emoji: '😰', name: 'Anxious', color: '#FF7043' },
            excited: { emoji: '🤩', name: 'Excited', color: '#AB47BC' },
            calm: { emoji: '😌', name: 'Calm', color: '#66BB6A' },
            angry: { emoji: '😡', name: 'Angry', color: '#EF5350' },
            confused: { emoji: '😕', name: 'Confused', color: '#FFA726' },
            grateful: { emoji: '🙏', name: 'Grateful', color: '#26A69A' },
            lonely: { emoji: '😔', name: 'Lonely', color: '#7E57C2' },
            hopeful: { emoji: '🌟', name: 'Hopeful', color: '#FFCA28' },
            stressed: { emoji: '😤', name: 'Stressed', color: '#FF5722' },
            peaceful: { emoji: '🕊️', name: 'Peaceful', color: '#4FC3F7' },
            energized: { emoji: '⚡', name: 'Energized', color: '#FFEB3B' },
            overwhelmed: { emoji: '🤯', name: 'Overwhelmed', color: '#F06292' },
            content: { emoji: '😊', name: 'Content', color: '#AED581' },
            frustrated: { emoji: '😠', name: 'Frustrated', color: '#FF8A65' },
            inspired: { emoji: '💡', name: 'Inspired', color: '#FFD740' },
            melancholy: { emoji: '🌧️', name: 'Melancholy', color: '#90A4AE' },
            motivated: { emoji: '🔥', name: 'Motivated', color: '#FF6D00' },
            vulnerable: { emoji: '🥺', name: 'Vulnerable', color: '#F8BBD9' },
            empowered: { emoji: '💪', name: 'Empowered', color: '#6A1B9A' },
            nostalgic: { emoji: '📸', name: 'Nostalgic', color: '#D4A574' },
            proud: { emoji: '😤', name: 'Proud', color: '#FF9800' },
            curious: { emoji: '🤔', name: 'Curious', color: '#9C27B0' },
            bored: { emoji: '😑', name: 'Bored', color: '#607D8B' },
            surprised: { emoji: '😲', name: 'Surprised', color: '#FF5722' },
            creative: { emoji: '🎨', name: 'Creative', color: '#FF7043' },
            determined: { emoji: '😤', name: 'Determined', color: '#3F51B5' },
            playful: { emoji: '😜', name: 'Playful', color: '#FF4081' },
            dreamy: { emoji: '😴', name: 'Dreamy', color: '#9FA8DA' },
            silly: { emoji: '🤪', name: 'Silly', color: '#FFC107' },
        };
        Object.entries(defaultMoods).forEach(([id, data]) => {
            map[id] = { emoji: data.emoji, label: data.name, color: data.color };
        });
        return map;
    }, []);

    // Recent mood entries (last 14 days) for timeline, sorted newest first
    const recentEntries = useMemo(() => {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return [...moodHistory]
            .filter(e => new Date(e.timestamp) >= twoWeeksAgo)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [moodHistory]);

    // Group entries by date
    const groupedEntries = useMemo(() => {
        const groups: Record<string, MoodEntry[]> = {};
        recentEntries.forEach(entry => {
            const d = new Date(entry.timestamp);
            const key = d.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
            if (!groups[key]) groups[key] = [];
            groups[key].push(entry);
        });
        return groups;
    }, [recentEntries]);

    const formatTime = (ts: string) => {
        return new Date(ts).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative w-full max-w-lg max-h-[85vh] overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#1a1a2e] to-[#16162a] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header gradient */}
                <div className="relative p-6 pb-4 bg-gradient-to-b from-orange-500/10 to-transparent">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 transition-colors"
                        aria-label="Close streak details"
                    >
                        <X className="w-5 h-5 text-white/60" />
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <motion.div
                            animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Flame className="w-8 h-8 text-orange-400" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white">Reflection Streak</h2>
                    </div>

                    {/* Streak Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Flame className="w-4 h-4 text-orange-400" />
                            </div>
                            <p className="text-2xl font-black text-white tabular-nums">{streakData.currentStreak}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Current</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Trophy className="w-4 h-4 text-yellow-400" />
                            </div>
                            <p className="text-2xl font-black text-white tabular-nums">{streakData.longestStreak}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Longest</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Calendar className="w-4 h-4 text-blue-400" />
                            </div>
                            <p className="text-sm font-bold text-white">
                                {streakData.lastLoggedDate
                                    ? new Date(streakData.lastLoggedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    : '—'}
                            </p>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Last Log</p>
                        </div>
                    </div>

                    {/* Streak continuity dots (last 7 days) */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (6 - i));
                            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            const isLogged = streakData.streakDates.includes(dateStr);
                            const isToday = i === 6;
                            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);

                            return (
                                <div key={dateStr} className="flex flex-col items-center gap-1">
                                    <motion.div
                                        className={`w-4 h-4 rounded-full border ${isLogged
                                                ? 'bg-orange-400 border-orange-300 shadow-sm shadow-orange-400/50'
                                                : isToday
                                                    ? 'border-white/40 border-dashed'
                                                    : 'border-white/15 bg-white/5'
                                            }`}
                                        initial={false}
                                        animate={isLogged ? { scale: [1, 1.2, 1] } : {}}
                                        transition={{ delay: i * 0.05, duration: 0.3 }}
                                        title={`${dateStr}${isToday ? ' (Today)' : ''}`}
                                    />
                                    <span className="text-[9px] text-white/30">{dayLabel}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Streak info text */}
                    <div className="mt-3 flex items-center gap-1.5 px-1">
                        <TrendingUp className="w-3 h-3 text-white/30 flex-shrink-0" />
                        <p className="text-[11px] text-white/30">
                            A streak is maintained by logging at least one mood per calendar day.
                        </p>
                    </div>

                    {/* Smart Nudge */}
                    <AnimatePresence>
                        {topNudge && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mt-3"
                            >
                                <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-3">
                                    <button
                                        onClick={handleDismissNudge}
                                        className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                                        aria-label="Dismiss nudge"
                                    >
                                        <X className="w-3 h-3 text-white/30" />
                                    </button>
                                    <div className="flex items-start gap-2 pr-4">
                                        <span className="text-lg flex-shrink-0">{topNudge.emoji}</span>
                                        <p className="text-xs text-white/60 leading-relaxed">{topNudge.message}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mood Timeline */}
                <div className="px-6 pb-6 overflow-y-auto max-h-[50vh] custom-scrollbar">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Mood Timeline</h3>
                    </div>

                    {Object.keys(groupedEntries).length === 0 ? (
                        /* Empty state */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10"
                        >
                            <div className="text-4xl mb-3">🌿</div>
                            <p className="text-white/40 text-sm mb-1">No reflections yet</p>
                            <p className="text-white/25 text-xs">Select a mood above to start your first entry</p>
                        </motion.div>
                    ) : (
                        /* Vertical Timeline */
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-purple-500/40 via-white/10 to-transparent" />

                            {Object.entries(groupedEntries).map(([dateLabel, entries], groupIdx) => (
                                <div key={dateLabel} className="mb-5">
                                    {/* Date label */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: groupIdx * 0.1 }}
                                        className="flex items-center gap-3 mb-2"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center z-10">
                                            <Calendar className="w-3.5 h-3.5 text-purple-300" />
                                        </div>
                                        <span className="text-xs font-semibold text-white/50">{dateLabel}</span>
                                    </motion.div>

                                    {/* Entries within the day */}
                                    {entries.map((entry, entryIdx) => {
                                        const moodKey = entry.emotion || entry.mood;
                                        const moodInfo = moodMap[moodKey] || { emoji: '🫥', label: moodKey, color: '#888' };

                                        return (
                                            <motion.div
                                                key={entry.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: groupIdx * 0.1 + entryIdx * 0.05 }}
                                                className="ml-10 mb-2 group/entry"
                                            >
                                                <div className="relative rounded-xl bg-white/5 border border-white/10 p-3 hover:bg-white/8 transition-colors">
                                                    {/* Timeline connector dot */}
                                                    <div
                                                        className="absolute -left-[26px] top-4 w-2.5 h-2.5 rounded-full border-2 z-10"
                                                        style={{
                                                            borderColor: moodInfo.color,
                                                            backgroundColor: `${moodInfo.color}40`,
                                                        }}
                                                    />

                                                    <div className="flex items-start gap-3">
                                                        <span className="text-2xl flex-shrink-0">{moodInfo.emoji}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <span
                                                                    className="text-sm font-semibold"
                                                                    style={{ color: moodInfo.color }}
                                                                >
                                                                    {moodInfo.label}
                                                                </span>
                                                                <span className="text-[10px] text-white/30">
                                                                    {formatTime(entry.timestamp)}
                                                                </span>
                                                            </div>
                                                            {entry.date && (
                                                                <p className="text-xs text-white/35 mt-1 line-clamp-2">
                                                                    {entry.date}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
