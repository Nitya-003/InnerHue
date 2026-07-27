'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Calendar,
  Trophy,
  Smile,
  Compass,
  BookOpen,
  Sparkles,
  Trophy as TrophyIcon,
  CheckCircle2,
} from 'lucide-react';
import { AchievementCard } from './AchievementCard';
import { MoodEntry } from '@/lib/useMoodStore';

interface AchievementGalleryProps {
  moodHistory: MoodEntry[];
}

const POSITIVE_KEYWORDS = [
  'happy', 'joy', 'calm', 'peaceful', 'excited', 'content', 'grateful',
  'serene', 'cheerful', 'relaxed', 'positive', 'zen', 'hopeful', 'blessed',
  'loved', 'confident', 'optimistic', 'motivated', 'energetic', 'playful',
  'inspired', 'proud', 'romantic', 'determined', 'adventurous'
];

export function AchievementGallery({ moodHistory }: AchievementGalleryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Timezone-safe local calendar date helper (YYYY-MM-DD)
  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Chronologically calculate unlock states and progress
  const achievements = useMemo(() => {
    const sorted = [...moodHistory].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Initialize track variables
    const uniqueDays = new Set<string>();
    const uniqueEmotions = new Set<string>();
    let positiveCount = 0;
    let notesCount = 0;

    // Unlock dates
    let firstUnlockDate: string | null = null;
    let tracker7UnlockDate: string | null = null;
    let consistency30UnlockDate: string | null = null;
    let positive5UnlockDate: string | null = null;
    let explorer5UnlockDate: string | null = null;
    let master10UnlockDate: string | null = null;

    sorted.forEach((entry) => {
      const entryDateObj = new Date(entry.timestamp);
      const dateStr = getLocalDateString(entryDateObj);
      const emotionKey = (entry.emotion || entry.mood || '').toLowerCase().trim();

      // 1. First reflection
      if (!firstUnlockDate) {
        firstUnlockDate = entry.timestamp;
      }

      // Track unique calendar days
      uniqueDays.add(dateStr);
      if (uniqueDays.size === 7 && !tracker7UnlockDate) {
        tracker7UnlockDate = entry.timestamp;
      }
      if (uniqueDays.size === 30 && !consistency30UnlockDate) {
        consistency30UnlockDate = entry.timestamp;
      }

      // Track positive moods
      const isPositive = POSITIVE_KEYWORDS.some((kw) => emotionKey.includes(kw));
      if (isPositive) {
        positiveCount++;
        if (positiveCount === 5 && !positive5UnlockDate) {
          positive5UnlockDate = entry.timestamp;
        }
      }

      // Track unique emotions
      if (emotionKey) {
        uniqueEmotions.add(emotionKey);
        if (uniqueEmotions.size === 5 && !explorer5UnlockDate) {
          explorer5UnlockDate = entry.timestamp;
        }
      }

      // Track reflections with notes
      if (entry.notes && entry.notes.trim().length > 0) {
        notesCount++;
        if (notesCount === 10 && !master10UnlockDate) {
          master10UnlockDate = entry.timestamp;
        }
      }
    });

    return [
      {
        id: 'first_reflection',
        title: 'First Reflection',
        description: 'Began your emotional wellness journey by logging your first reflection.',
        icon: Award,
        isUnlocked: sorted.length >= 1,
        unlockDate: firstUnlockDate,
        progress: sorted.length >= 1 ? 1 : 0,
        maxProgress: 1,
        colorClass: 'from-purple-500 to-pink-500',
      },
      {
        id: 'tracker_7_day',
        title: '7-Day Mood Tracker',
        description: 'Build a reflection habit by tracking your mood on 7 different days.',
        icon: Calendar,
        isUnlocked: uniqueDays.size >= 7,
        unlockDate: tracker7UnlockDate,
        progress: Math.min(uniqueDays.size, 7),
        maxProgress: 7,
        colorClass: 'from-blue-500 to-cyan-500',
      },
      {
        id: 'consistency_30_day',
        title: '30-Day Consistency',
        description: 'Establish long-term self-awareness by logging for 30 different days.',
        icon: Trophy,
        isUnlocked: uniqueDays.size >= 30,
        unlockDate: consistency30UnlockDate,
        progress: Math.min(uniqueDays.size, 30),
        maxProgress: 30,
        colorClass: 'from-orange-500 to-amber-500',
      },
      {
        id: 'positive_mindset',
        title: 'Positive Mindset',
        description: 'Focus on the bright side by logging 5 positive moods.',
        icon: Smile,
        isUnlocked: positiveCount >= 5,
        unlockDate: positive5UnlockDate,
        progress: Math.min(positiveCount, 5),
        maxProgress: 5,
        colorClass: 'from-rose-500 to-orange-400',
      },
      {
        id: 'emotional_explorer',
        title: 'Emotional Explorer',
        description: 'Embrace complexity by exploring at least 5 different emotions.',
        icon: Compass,
        isUnlocked: uniqueEmotions.size >= 5,
        unlockDate: explorer5UnlockDate,
        progress: Math.min(uniqueEmotions.size, 5),
        maxProgress: 5,
        colorClass: 'from-emerald-500 to-teal-400',
      },
      {
        id: 'reflection_master',
        title: 'Reflection Master',
        description: 'Deepen your mindfulness by writing 10 reflections with journal notes.',
        icon: BookOpen,
        isUnlocked: notesCount >= 10,
        unlockDate: master10UnlockDate,
        progress: Math.min(notesCount, 10),
        maxProgress: 10,
        colorClass: 'from-indigo-500 to-violet-500',
      },
    ];
  }, [moodHistory]);

  const unlockedCount = useMemo(() => {
    return achievements.filter((a) => a.isUnlocked).length;
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    if (activeTab === 'unlocked') {
      return achievements.filter((a) => a.isUnlocked);
    }
    if (activeTab === 'locked') {
      return achievements.filter((a) => !a.isUnlocked);
    }
    return achievements;
  }, [achievements, activeTab]);

  const overallProgressPercentage = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="space-y-6">
      {/* Overview Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8
          bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl
          border border-slate-200/80 dark:border-white/10
          shadow-xl"
      >
        {/* Light reflection effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300">
              <TrophyIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Emotional Milestones
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Reflect daily, unlock positive insights, and track your wellness milestones.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:w-64">
            <div className="flex justify-between items-baseline text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                Unlocked
              </span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                {unlockedCount} / {achievements.length}
              </span>
            </div>
            
            {/* Master Progress Bar */}
            <div className="h-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Filter */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="inline-flex p-1 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-black/5 dark:border-white/5 backdrop-blur-md">
          {(['all', 'unlocked', 'locked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
              aria-pressed={activeTab === tab}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Small motivational hint */}
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          Keep logging to earn rewards!
        </span>
      </div>

      {/* Achievements Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement, idx) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <AchievementCard
                title={achievement.title}
                description={achievement.description}
                icon={achievement.icon}
                isUnlocked={achievement.isUnlocked}
                unlockDate={achievement.unlockDate}
                progress={achievement.progress}
                maxProgress={achievement.maxProgress}
                colorClass={achievement.colorClass}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500"
          >
            No achievements to display in this filter.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
