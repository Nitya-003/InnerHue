'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Lock } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isUnlocked: boolean;
  unlockDate: string | null;
  progress: number;
  maxProgress: number;
  colorClass: string; // Gradient color class e.g., 'from-purple-500 to-pink-500'
}

export function AchievementCard({
  title,
  description,
  icon: Icon,
  isUnlocked,
  unlockDate,
  progress,
  maxProgress,
  colorClass,
}: AchievementCardProps) {
  const progressPercentage = Math.min(Math.round((progress / maxProgress) * 100), 100);

  const formattedDate = unlockDate
    ? new Date(unlockDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
      tabIndex={0}
      role="article"
      aria-label={`Achievement: ${title}. ${
        isUnlocked 
          ? `Unlocked on ${formattedDate}` 
          : `Locked. Progress: ${progress} out of ${maxProgress} (${progressPercentage}%)`
      }`}
      className="relative overflow-hidden rounded-3xl p-6 transition-all duration-300
        bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
        border border-slate-200/80 dark:border-white/10
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
        hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
    >
      {/* Light Reflection Glow Overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

      {/* Decorative colored glow when unlocked */}
      {isUnlocked && (
        <div 
          className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none bg-gradient-to-br ${colorClass}`} 
        />
      )}

      <div className="flex items-start gap-4">
        {/* Badge Icon Container */}
        <div className="relative flex-shrink-0">
          <motion.div
            initial={false}
            animate={
              isUnlocked
                ? { scale: [1, 1.05, 1] }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 shadow-inner
              ${
                isUnlocked
                  ? `bg-gradient-to-br ${colorClass} text-white shadow-md shadow-purple-500/10`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
              }`}
          >
            {isUnlocked ? (
              <Icon className="w-7 h-7" aria-hidden="true" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Icon className="w-7 h-7 opacity-40 grayscale" aria-hidden="true" />
                <div className="absolute -bottom-1 -right-1 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5 border border-white dark:border-slate-800">
                  <Lock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                </div>
              </div>
            )}
          </motion.div>

          {/* Pulsing glow ring for unlocked badges */}
          {isUnlocked && (
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClass} -z-10`}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
              {title}
            </h4>
            
            {/* Badge Status Text */}
            {isUnlocked ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 w-fit">
                Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 w-fit">
                Locked
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {description}
          </p>

          {/* Unlock Date / Progress Area */}
          {isUnlocked ? (
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1.5">
              <span>Unlocked on</span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold">{formattedDate}</span>
            </p>
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                <span>Progress</span>
                <span className="text-slate-700 dark:text-slate-300 tabular-nums">
                  {progress} / {maxProgress} ({progressPercentage}%)
                </span>
              </div>

              {/* Progress bar container */}
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
                  className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
